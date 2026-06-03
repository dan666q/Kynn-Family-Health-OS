const mongoose = require('mongoose');
const env = require('./config/env');

// Models
const User = require('./modules/auth/user.model');
const Family = require('./modules/family/family.model');
const Member = require('./modules/member/member.model');
const Medication = require('./modules/medication/medication.model');
const MedicationLog = require('./modules/medication/medicationLog.model');
const Activity = require('./modules/timeline/activity.model');

const seed = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await mongoose.connect(env.MONGO_URI);
    console.log('[Seed] Connected. Clearing existing collections...');

    // Clear existing data
    await User.deleteMany({});
    await Family.deleteMany({});
    await Member.deleteMany({});
    await Medication.deleteMany({});
    await MedicationLog.deleteMany({});
    await Activity.deleteMany({});

    console.log('[Seed] Database cleared. Creating Family...');

    // 1. Create Family
    const family = await Family.create({
      name: 'Gia Đình Hoàng Hà',
      avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?w=200',
      ownerId: new mongoose.Types.ObjectId(), // Temporary owner, will update shortly
      inviteCode: 'KYNN99'
    });

    console.log('[Seed] Family created (Invite Code: KYNN99). Creating Users...');

    // 2. Create User 1: Administrator/Owner (Con gái Lê Hoàng Lan)
    const adminUser = await User.create({
      name: 'Lê Hoàng Lan',
      email: 'admin@kynn.vn',
      password: 'password123', // Will be hashed automatically by pre-save hook
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      provider: 'local',
      familyId: family._id
    });

    // Update Family ownerId with real admin user id
    family.ownerId = adminUser._id;
    await family.save();

    // 3. Create User 2: Normal Member / Caregiver (Nguyễn Văn Nam)
    const normalUser = await User.create({
      name: 'Nguyễn Văn Nam',
      email: 'member@kynn.vn',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      provider: 'local',
      familyId: family._id
    });

    console.log('[Seed] Users created:\n - Admin: admin@kynn.vn / password123\n - Member: member@kynn.vn / password123');
    console.log('[Seed] Creating Family Members...');

    // 4. Create Family Members
    const grandpa = await Member.create({
      familyId: family._id,
      role: 'Ông',
      fullName: 'Hoàng Văn Nội',
      birthday: new Date('1945-10-12'),
      bloodType: 'O+',
      allergies: ['Penicillin', 'Cua biển'],
      chronicDiseases: ['Cao huyết áp', 'Tiểu đường Type 2'],
      emergencyContact: {
        name: 'Lê Hoàng Lan (Con gái)',
        phone: '0987654321',
        relationship: 'Con gái'
      },
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });

    const daughter = await Member.create({
      familyId: family._id,
      role: 'Bé',
      fullName: 'Hoàng Bé Bắp (Bé Út)',
      birthday: new Date('2020-05-15'),
      bloodType: 'O+',
      allergies: ['Đậu phộng', 'Bột giặt Comfort'],
      chronicDiseases: ['Hen phế quản nhẹ'],
      emergencyContact: {
        name: 'Lê Hoàng Lan (Mẹ)',
        phone: '0987654321',
        relationship: 'Mẹ'
      },
      avatar: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=150'
    });

    const father = await Member.create({
      familyId: family._id,
      role: 'Ba',
      fullName: 'Hoàng Văn Sơn',
      birthday: new Date('1972-03-24'),
      bloodType: 'A+',
      allergies: ['Không dị ứng'],
      chronicDiseases: ['Gout nhẹ'],
      emergencyContact: {
        name: 'Lê Hoàng Lan (Vợ)',
        phone: '0987654321',
        relationship: 'Vợ'
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });

    console.log('[Seed] Members created. Creating Medications...');

    // 5. Create Medications
    const med1 = await Medication.create({
      memberId: grandpa._id,
      name: 'Metformin 500mg (Trị tiểu đường)',
      dosage: '1 viên',
      frequency: 'daily',
      schedule: ['08:00', '20:00'],
      notes: 'Uống ngay sau khi ăn sáng và ăn tối no. Không uống khi đói.',
      active: true
    });

    const med2 = await Medication.create({
      memberId: grandpa._id,
      name: 'Amlodipine 5mg (Huyết áp)',
      dosage: '1 viên',
      frequency: 'daily',
      schedule: ['08:00'],
      notes: 'Uống vào buổi sáng sau khi ngủ dậy.',
      active: true
    });

    const med3 = await Medication.create({
      memberId: daughter._id,
      name: 'Ventolin Inhaler 100mcg (Xịt hen)',
      dosage: 'Xịt 1 nhát',
      frequency: 'custom',
      schedule: ['Khi khò khè / Khó thở'],
      notes: 'Lắc kỹ trước khi xịt, súc miệng nước ấm sau xịt.',
      active: true
    });

    // 6. Create initial Care activities timeline logs
    await Activity.create({
      familyId: family._id,
      actorId: adminUser._id,
      type: 'member_created',
      message: `Lê Hoàng Lan đã thiết lập hồ sơ sức khỏe khẩn cấp cho Ông Nội (Hoàng Văn Nội)`
    });

    await Activity.create({
      familyId: family._id,
      actorId: adminUser._id,
      type: 'medication_added',
      message: `Lê Hoàng Lan đã thêm lịch uống thuốc: Metformin 500mg cho Hoàng Văn Nội`
    });

    await Activity.create({
      familyId: family._id,
      actorId: normalUser._id,
      type: 'member_created',
      message: `Nguyễn Văn Nam đã gia nhập nhóm gia đình chăm sóc sức khỏe`
    });

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Seeding failed:', err);
    process.exit(1);
  }
};

seed();
