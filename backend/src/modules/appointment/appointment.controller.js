const Appointment = require('./appointment.model');
const Member = require('../member/member.model');
const Activity = require('../timeline/activity.model');
const response = require('../../utils/response');
const socketConfig = require('../../config/socket');

const emitSocketEvent = (familyId, eventName, data) => {
  const io = socketConfig.getIO();
  if (io && familyId) {
    io.to(familyId.toString()).emit(eventName, data);
  }
};

// Get all appointments for the user's family
exports.getAppointments = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.success(res, { appointments: [] });
    }

    const members = await Member.find({ familyId: req.user.familyId });
    const memberIds = members.map(m => m._id);

    const appointments = await Appointment.find({ memberId: { $in: memberIds } })
      .populate('memberId')
      .sort({ appointmentDate: 1 });

    return response.success(res, { appointments });
  } catch (err) {
    next(err);
  }
};

// Create a new medical appointment
exports.createAppointment = async (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return response.error(res, 'You must join or create a family first', 400);
    }

    const { memberId, hospital, doctor, appointmentDate, notes } = req.body;

    if (!memberId || !hospital || !appointmentDate) {
      return response.error(res, 'Member ID, hospital, and appointment date are required', 400);
    }

    // Verify member belongs to family
    const member = await Member.findOne({ _id: memberId, familyId: req.user.familyId });
    if (!member) {
      return response.error(res, 'Member not found in your family', 403);
    }

    const appointment = await Appointment.create({
      memberId,
      hospital,
      doctor: doctor || '',
      appointmentDate,
      notes: notes || '',
      createdBy: req.user._id
    });

    const parsedDate = new Date(appointmentDate);
    const formattedDate = parsedDate.toLocaleDateString('vi-VN') + ' ' + parsedDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Log Activity
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'appointment_created',
      targetId: appointment._id.toString(),
      message: `${req.user.name} đã lên lịch hẹn khám cho ${member.fullName} tại ${hospital} vào ${formattedDate}`
    });

    emitSocketEvent(req.user.familyId, 'appointment_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    // Return populated appointment
    const populated = await Appointment.findById(appointment._id).populate('memberId');

    return response.success(res, { appointment: populated }, 201);
  } catch (err) {
    next(err);
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.familyId) {
      return response.error(res, 'Unauthorized', 403);
    }

    const appointment = await Appointment.findById(id).populate('memberId');
    if (!appointment) {
      return response.error(res, 'Appointment not found', 404);
    }

    // Verify member family
    if (!appointment.memberId || appointment.memberId.familyId.toString() !== req.user.familyId.toString()) {
      return response.error(res, 'Unauthorized access to this appointment', 403);
    }

    const member = appointment.memberId;

    await Appointment.findByIdAndDelete(id);

    // Log Activity
    await Activity.create({
      familyId: req.user.familyId,
      actorId: req.user._id,
      type: 'appointment_deleted',
      targetId: id,
      message: `${req.user.name} đã hủy lịch hẹn khám của ${member.fullName} tại ${appointment.hospital}`
    });

    emitSocketEvent(req.user.familyId, 'appointment_updated');
    emitSocketEvent(req.user.familyId, 'timeline_updated');

    return response.success(res, { message: 'Appointment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
