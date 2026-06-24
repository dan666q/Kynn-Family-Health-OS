const Medication = require('./medication.model');
const MedicationLog = require('./medicationLog.model');
const Member = require('../member/member.model');
const Activity = require('../timeline/activity.model');
const response = require('../../utils/response');
const socketConfig = require('../../config/socket');

// Helper to emit socket events dynamically
const emitSocketEvent = (familyId, eventName, data) => {
  const io = socketConfig.getIO();
  if (io && familyId) {
    io.to(familyId.toString()).emit(eventName, data);
  }
};


// Helper to verify if a member belongs to the user's family
const verifyMemberInFamily = async (memberId, familyId) => {
  const member = await Member.findOne({ _id: memberId, familyId });
  return !!member;
};

// Retrieve all medications for members of user's family
exports.getMedications = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { medications: [] });
    }

    // Find all family members
    const members = await Member.find({ familyId: req.user.familyId });
    const memberIds = members.map(m => m._id);

    // Find medications for these members
    const medications = await Medication.find({ memberId: { $in: memberIds } });
    return response.success(res, { medications });
  } catch (err) {
    next(err);
  }
};

// Add a medication
exports.createMedication = async (req, res, next) => {
  try {
    const { memberId, name, dosage, frequency, schedule, notes, active, voiceNoteUrl, voiceDuration } = req.body;

    if (!memberId || !name || !dosage || !schedule || !frequency) {
      return response.error(res, 'Member ID, name, dosage, frequency, and schedule slots are required', 400);
    }

    if (!req.user.familyId) {
      return response.error(res, 'You must be in a family to manage medications.', 403);
    }

    // Verify member belongs to family
    const belongs = await verifyMemberInFamily(memberId, req.user.familyId);
    if (!belongs) {
      return response.error(res, 'Member not found in your family.', 403);
    }

    const medication = await Medication.create({
      memberId,
      name,
      dosage,
      frequency,
      schedule,
      notes: notes || '',
      active: active !== undefined ? active : true,
      voiceNoteUrl: voiceNoteUrl || '',
      voiceDuration: voiceDuration || 0
    });

    // Create Activity Log
    const member = await Member.findById(memberId);
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'medication_added',
      targetId: medication._id.toString(),
      message: `${req.user.name} đã thêm thuốc mới "${name}" cho ${member.fullName} (${member.role})`
    });

    emitSocketEvent(req.user.familyId, 'medication_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    return response.success(res, { medication }, 201);
  } catch (err) {
    next(err);
  }
};

// Update a medication
exports.updateMedication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized access.', 403);
    }

    // Find medication
    const medication = await Medication.findById(id);
    if (!medication) {
      return response.error(res, 'Medication not found', 404);
    }

    // Verify member belongs to user's family
    const belongs = await verifyMemberInFamily(medication.memberId, req.user.familyId);
    if (!belongs) {
      return response.error(res, 'Medication does not belong to your family.', 403);
    }

    // Prevent updating memberId
    const updates = req.body;
    delete updates.memberId;

    const updatedMedication = await Medication.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    // Create Activity Log
    const member = await Member.findById(medication.memberId);
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'medication_updated',
      targetId: id,
      message: `${req.user.name} đã cập nhật thông tin thuốc "${updatedMedication.name}" của ${member.fullName}`
    });

    emitSocketEvent(req.user.familyId, 'medication_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    return response.success(res, { medication: updatedMedication });
  } catch (err) {
    next(err);
  }
};

// Delete a medication
exports.deleteMedication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized access.', 403);
    }

    const medication = await Medication.findById(id);
    if (!medication) {
      return response.error(res, 'Medication not found', 404);
    }

    // Verify member belongs to family
    const belongs = await verifyMemberInFamily(medication.memberId, req.user.familyId);
    if (!belongs) {
      return response.error(res, 'Medication does not belong to your family.', 403);
    }

    const member = await Member.findById(medication.memberId);

    // Delete medication
    await Medication.findByIdAndDelete(id);

    // Delete associated logs
    await MedicationLog.deleteMany({ medicationId: id });

    // Create Activity Log
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'medication_deleted',
      targetId: id,
      message: `${req.user.name} đã xóa thuốc "${medication.name}" khỏi danh mục của ${member.fullName}`
    });

    emitSocketEvent(req.user.familyId, 'medication_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    return response.success(res, { message: 'Medication and associated logs deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// Record/Toggle medication confirmation log (taken, missed, skipped)
exports.toggleMedicationLog = async (req, res, next) => {
  try {
    const { medicationId, status, timeSlot, dateStr } = req.body;

    if (!medicationId || !status || !timeSlot) {
      return response.error(res, 'Medication ID, status (taken/missed/skipped), and timeSlot are required', 400);
    }

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized access.', 403);
    }

    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return response.error(res, 'Medication not found', 404);
    }

    // Verify family ownership
    const belongs = await verifyMemberInFamily(medication.memberId, req.user.familyId);
    if (!belongs) {
      return response.error(res, 'Medication does not belong to your family.', 403);
    }

    // We check if a log already exists for this medication, this timeSlot, and this date.
    const targetDateStr = dateStr || new Date().toISOString().split('T')[0];
    const startOfDay = new Date(`${targetDateStr}T00:00:00Z`);
    const endOfDay = new Date(`${targetDateStr}T23:59:59Z`);

    const existingLog = await MedicationLog.findOne({
      medicationId,
      timeSlot,
      takenAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const member = await Member.findById(medication.memberId);

    if (existingLog) {
      // Toggle off: Delete the log
      await MedicationLog.findByIdAndDelete(existingLog._id);

      // Log activity
      await Activity.create({
        familyId: req.user.familyId,
        actorId: req.user._id,
        type: 'medication_missed',
        targetId: medicationId,
        message: `${req.user.name} đã hủy xác nhận uống thuốc "${medication.name}" của ${member.fullName}`
      });

      emitSocketEvent(req.user.familyId, 'medication_updated');
      emitSocketEvent(req.user.familyId, 'timeline_updated');

      return response.success(res, { toggled: false, message: 'Medication confirmation removed.' });
    } else {
      // Toggle on: Create the log
      const newLog = await MedicationLog.create({
        medicationId,
        memberId: medication.memberId,
        checkedBy: `${req.user.name} (Con cháu)`,
        status,
        timeSlot,
        takenAt: new Date()
      });

      // Log activity
      await Activity.create({
        familyId: req.user.familyId,
        actorId: req.user._id,
        type: 'medication_taken',
        targetId: medicationId,
        message: `${req.user.name} đã xác nhận ${member.fullName} đã uống thuốc "${medication.name}" vào khung giờ ${timeSlot}`
      });

      emitSocketEvent(req.user.familyId, 'medication_updated');
      emitSocketEvent(req.user.familyId, 'timeline_updated');

      return response.success(res, { toggled: true, log: newLog, message: 'Medication intake recorded successfully.' }, 201);
    }
  } catch (err) {
    next(err);
  }
};

// Retrieve all medication logs for user's family members
exports.getMedicationLogs = async (req, res, next) => {
  try {
    const { date } = req.query; // Expecting YYYY-MM-DD

    if (!req.user.familyId) {
      return response.success(res, { logs: [] });
    }

    const members = await Member.find({ familyId: req.user.familyId });
    const memberIds = members.map(m => m._id);

    let query = { memberId: { $in: memberIds } };

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00Z`);
      const endOfDay = new Date(`${date}T23:59:59Z`);
      query.takenAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const logs = await MedicationLog.find(query).sort({ takenAt: -1 });
    return response.success(res, { logs });
  } catch (err) {
    next(err);
  }
};

