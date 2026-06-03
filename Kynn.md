# FAMILY HEALTH OS
## Hệ thống phối hợp chăm sóc sức khỏe gia đình

---

# 1. GIỚI THIỆU DỰ ÁN

## Tên dự án
Kynn — Family Health OS
K.Y.N.N
Keep Your Next of Kin Near
giữ gia đình luôn kết nối
---

## Mô tả ngắn
Ứng dụng mobile giúp các thành viên trong gia đình phối hợp chăm sóc sức khỏe cho:
- ông bà
- cha mẹ
- người bệnh nền
- trẻ nhỏ

Thông qua:
- quản lý thuốc
- ghi âm hướng dẫn chăm sóc
- timeline chăm sóc realtime
- hồ sơ y tế
- emergency card
- nhắc nhở offline

---

## Vấn đề thực tế
Hiện tại các gia đình thường:
- nhắn tin qua Zalo/Messenger
- lưu toa thuốc bằng ảnh
- gửi voice message
- nhớ bằng trí nhớ

Điều này gây ra:
- mất context
- quên thuốc
- khó thay phiên chăm sóc
- khó xử lý emergency
- phụ thuộc vào một người trong gia đình

---

## Giải pháp
Kynn cung cấp:
- hệ thống chăm sóc tập trung
- trạng thái thuốc realtime
- timeline chăm sóc
- hồ sơ khẩn cấp
- voice instructions
- reminder offline

Giúp gia đình phối hợp chăm sóc dễ dàng hơn.

---

# 2. MỤC TIÊU DỰ ÁN

## Mục tiêu chính
Xây dựng một hệ thống:
- đơn giản
- dễ dùng cho người lớn tuổi
- hoạt động ổn định offline
- hỗ trợ chăm sóc gia đình thực tế

---

## Định hướng UX
- Calm UI
- Elder-friendly
- Ít thao tác
- Tối đa 2 tap cho hành động quan trọng
- Camera-first
- Voice-first

---

# 3. ĐỐI TƯỢNG SỬ DỤNG

## Primary Users
Người từ 22–40 tuổi đang:
- chăm sóc cha mẹ
- chăm sóc ông bà
- quản lý thuốc cho gia đình

---

## Secondary Users
- Người lớn tuổi
- Người bệnh nền
- Người chăm sóc thay phiên nhau

---

# 4. CORE FEATURES

# 4.1 Authentication

## Chức năng
- Đăng nhập Google
- JWT Authentication
- Refresh Token
- Logout

---

# 4.2 Family Management

## Chức năng
- Tạo gia đình
- Tham gia gia đình bằng mã invite
- QR tham gia gia đình
- Chỉnh sửa thông tin gia đình
- Avatar gia đình

---

# 4.3 Member Profiles

## Chức năng
- Tạo profile thành viên
- Chọn vai trò:
  - Ông
  - Bà
  - Ba
  - Mẹ
  - Anh
  - Chị
  - Em
- Avatar
- Thông tin cá nhân

---

# 4.4 Health Profile

## Thông tin sức khỏe
- Nhóm máu
- Dị ứng
- Bệnh nền
- Tiền sử bệnh
- Emergency contact
- Ghi chú y tế

---

# 4.5 Medication Management

## Chức năng
- Thêm thuốc
- Chỉnh sửa thuốc
- Xóa thuốc
- Đặt lịch uống thuốc
- Theo dõi trạng thái thuốc
- Medication history

---

## Trạng thái thuốc
- Đã uống
- Chưa uống
- Bỏ lỡ

---

## Reminder
- Local notifications offline
- Push notification online
- Reminder lặp lại

---

# 4.6 Voice Care Instructions

## Chức năng
- Ghi âm hướng dẫn
- Play audio
- Lưu lịch sử voice note
- Voice note cho thuốc
- Voice note cho patient

---

## Ví dụ
“Thuốc trắng uống sau ăn sáng.”

---

# 4.7 Care Timeline

## Timeline realtime
Hiển thị:
- Đã uống thuốc
- Upload hồ sơ
- Ghi chú triệu chứng
- Voice note mới
- Cập nhật sức khỏe
- Lịch khám

---

## Realtime
- Socket.IO
- Đồng bộ realtime giữa các thành viên

---

# 4.8 Emergency Card

## Chức năng
Hiển thị nhanh:
- Nhóm máu
- Dị ứng
- Thuốc hiện tại
- Emergency contacts
- BHYT
- Bệnh nền

---

## Requirements
- Offline access
- Fast loading
- Large readable UI

---

# 4.9 Medical Document Storage

## Upload
- Ảnh
- PDF

---

## Loại tài liệu
- Toa thuốc
- Kết quả xét nghiệm
- BHYT
- CCCD
- Hồ sơ bệnh viện

---

## Chức năng
- Upload
- Preview
- Download
- Delete
- Update metadata

---

# 4.10 Symptoms Log

## Chức năng
- Ghi nhận triệu chứng
- Ghi chú sức khỏe
- Timeline symptoms

---

## Ví dụ
- Ho
- Sốt
- Đau đầu
- Chóng mặt

---

# 4.11 Appointments

## Chức năng
- Tạo lịch khám
- Reminder lịch khám
- Ghi chú khám bệnh
- Lưu kết quả khám

---

# 4.12 Notifications

## Notification Types

### Local Notification
- Nhắc uống thuốc offline
- Reminder offline

---

### Push Notification
- Realtime family updates
- Voice note mới
- Upload hồ sơ mới

---

# 4.13 Offline Mode

## Offline Features
- Emergency card
- Medication reminders
- Medication history
- Family info

---

## Sync khi online
- Queue sync actions
- Auto sync background

---

# 5. TECH STACK

# Frontend

## Mobile
- React Native
- Expo
- TypeScript

---

## State Management
- Zustand
- React Query

---

## Navigation
- React Navigation

---

## Notifications
- expo-notifications

---

## Local Database
- SQLite

---

## Audio
- expo-av
- expo-audio

---

## Forms
- React Hook Form
- Zod

---

# Backend

## Runtime
- Node.js

---

## Framework
- Express.js

---

## Database
- MongoDB
- Mongoose

---

## Realtime
- Socket.IO

---

## Authentication
- JWT
- Google OAuth

---

## File Upload
- Multer

---

## Cloud Storage
- Cloudinary hoặc AWS S3

---

## Notifications
- Firebase Cloud Messaging (FCM)

---

# DevOps
- Docker
- Docker Compose
- Nginx
- PM2

---

# 6. FRONTEND FOLDER STRUCTURE

```txt
src/
│
├── api/
│   ├── axios.ts
│   ├── auth.api.ts
│   ├── family.api.ts
│   ├── medication.api.ts
│   ├── document.api.ts
│   └── timeline.api.ts
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── components/
│   ├── common/
│   ├── cards/
│   ├── buttons/
│   ├── modals/
│   ├── inputs/
│   └── timeline/
│
├── constants/
│   ├── colors.ts
│   ├── fonts.ts
│   ├── spacing.ts
│   └── routes.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useMedication.ts
│   ├── useTimeline.ts
│   ├── useNotifications.ts
│   └── useSocket.ts
│
├── navigation/
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── AppNavigator.tsx
│
├── screens/
│   ├── auth/
│   ├── home/
│   ├── medication/
│   ├── documents/
│   ├── emergency/
│   ├── timeline/
│   ├── family/
│   └── profile/
│
├── services/
│   ├── socket.service.ts
│   ├── notification.service.ts
│   ├── storage.service.ts
│   └── sync.service.ts
│
├── store/
│   ├── auth.store.ts
│   ├── family.store.ts
│   ├── medication.store.ts
│   └── timeline.store.ts
│
├── types/
│   ├── auth.types.ts
│   ├── medication.types.ts
│   ├── timeline.types.ts
│   └── family.types.ts
│
├── utils/
│   ├── date.ts
│   ├── format.ts
│   ├── permissions.ts
│   └── notifications.ts
│
├── App.tsx
└── main.tsx
```

---

# 7. BACKEND FOLDER STRUCTURE (MVC)

```txt
src/
│
├── config/
│   ├── db.js
│   ├── env.js
│   ├── socket.js
│   └── cloudinary.js
│
├── modules/
│
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.model.js
│   │   ├── auth.routes.js
│   │   ├── auth.middleware.js
│   │   └── auth.validation.js
│   │
│   ├── family/
│   │   ├── family.controller.js
│   │   ├── family.service.js
│   │   ├── family.model.js
│   │   ├── family.routes.js
│   │   └── family.validation.js
│   │
│   ├── member/
│   │   ├── member.controller.js
│   │   ├── member.service.js
│   │   ├── member.model.js
│   │   ├── member.routes.js
│   │   └── member.validation.js
│   │
│   ├── medication/
│   │   ├── medication.controller.js
│   │   ├── medication.service.js
│   │   ├── medication.model.js
│   │   ├── medication.routes.js
│   │   └── medication.scheduler.js
│   │
│   ├── timeline/
│   │   ├── timeline.controller.js
│   │   ├── timeline.service.js
│   │   ├── timeline.model.js
│   │   ├── timeline.routes.js
│   │   └── timeline.socket.js
│   │
│   ├── document/
│   │   ├── document.controller.js
│   │   ├── document.service.js
│   │   ├── document.model.js
│   │   ├── document.routes.js
│   │   └── document.upload.js
│   │
│   ├── emergency/
│   │   ├── emergency.controller.js
│   │   ├── emergency.service.js
│   │   ├── emergency.model.js
│   │   └── emergency.routes.js
│   │
│   ├── notification/
│   │   ├── notification.service.js
│   │   ├── notification.model.js
│   │   └── notification.socket.js
│   │
│   └── voice/
│       ├── voice.controller.js
│       ├── voice.service.js
│       ├── voice.model.js
│       └── voice.routes.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── upload.middleware.js
│   └── role.middleware.js
│
├── sockets/
│   ├── index.js
│   ├── timeline.socket.js
│   └── notification.socket.js
│
├── jobs/
│   ├── medicationReminder.job.js
│   ├── notification.job.js
│   └── cleanup.job.js
│
├── utils/
│   ├── response.js
│   ├── logger.js
│   ├── generateToken.js
│   └── upload.js
│
├── app.js
└── server.js
```

---

# 8. DATABASE DESIGN

# Collections

## users
Thông tin account.

---

## families
Thông tin gia đình.

---

## members
Profile thành viên gia đình.

---

## medications
Danh sách thuốc.

---

## medication_logs
Lịch sử uống thuốc.

---

## activities
Timeline hoạt động.

---

## documents
Hồ sơ y tế.

---

## voice_notes
Voice instructions.

---

## reminders
Reminder schedules.

---

## appointments
Lịch khám.

---

# 9. ERD

```txt
USERS
- _id
- email
- name
- avatar
- provider
- createdAt

FAMILIES
- _id
- name
- avatar
- ownerId
- inviteCode
- createdAt

MEMBERS
- _id
- familyId
- userId
- role
- fullName
- birthday
- bloodType
- allergies[]
- chronicDiseases[]
- emergencyContact
- avatar

MEDICATIONS
- _id
- memberId
- name
- dosage
- frequency
- schedule
- notes
- active

MEDICATION_LOGS
- _id
- medicationId
- memberId
- checkedBy
- status
- takenAt

VOICE_NOTES
- _id
- medicationId
- memberId
- recordedBy
- audioUrl
- duration
- transcript
- createdAt

DOCUMENTS
- _id
- memberId
- uploadedBy
- type
- fileUrl
- fileName
- expiryDate
- notes
- createdAt

ACTIVITIES
- _id
- familyId
- actorId
- type
- targetId
- message
- metadata
- createdAt

REMINDERS
- _id
- memberId
- type
- title
- remindAt
- repeat
- active

APPOINTMENTS
- _id
- memberId
- hospital
- doctor
- appointmentDate
- notes

NOTIFICATIONS
- _id
- userId
- title
- body
- type
- isRead
- createdAt
```

---

# 10. REALTIME ARCHITECTURE

# Socket.IO Events

## Client → Server
- join_family
- medication_taken
- add_activity
- upload_document

---

## Server → Client
- timeline_updated
- medication_updated
- new_notification
- document_uploaded

---

# 11. OFFLINE-FIRST ARCHITECTURE

# Local Storage
SQLite cache:
- medications
- emergency card
- reminders
- family info

---

# Offline Flow

```txt
Action
→ Save local SQLite
→ Mark pending sync
→ Background sync when online
```

---

# Local Notifications
Dùng cho:
- medication reminders
- appointments
- recurring reminders

---

# Remote Push Notifications
Dùng cho:
- realtime updates
- family activities
- new voice notes

---

# 12. UI/UX DESIGN SYSTEM

# Design Keywords
- Warm
- Calm
- Soft
- Minimal
- Elder-friendly

---

# Colors

## Primary
- Soft Blue
- Soft Green

---

## Neutral
- Warm White
- Light Gray

---

# Typography
- Inter
- SF Pro

---

# Border Radius
16–24px

---

# UX Rules
- Max 2 taps
- Large touch targets
- Card-based UI
- Camera-first
- Voice-first

---

# Navigation

## Bottom Tabs
- Home
- Health
- Documents
- Family

---

# Home Screen

## Sections
- Today medications
- Upcoming reminders
- Care timeline
- Emergency shortcut

---

# 13. MVP FEATURES

# MUST HAVE
- Authentication
- Family management
- Patient profiles
- Medication tracking
- Voice notes
- Timeline
- Emergency card
- Medical documents
- Local notifications
- Offline support

---

# NICE TO HAVE
- OCR toa thuốc
- Speech-to-text
- AI summary
- QR emergency access

---

# 14. SECURITY

# Authentication
- JWT
- Refresh token
- Secure session

---

# File Security
- Secure cloud storage
- Signed URLs
- Private uploads

---

# API Security
- HTTPS only
- Rate limiting
- Helmet
- CORS

---

# 15. FUTURE EXPANSION

## AI Features
- OCR prescription scanning
- Medication extraction
- Voice transcription
- AI health summaries

---

## Healthcare Integration
- Hospital APIs
- Insurance integration
- Smartwatch integration

---

# 16. PROJECT ANALYSIS

# Điểm mạnh
- Emotional retention cao
- Pain thực tế
- Realtime caregiving
- Elder-focused UX
- Offline-first
- Hard to replace bằng chat app

---

# Rủi ro
- User onboarding
- Privacy concerns
- Notification reliability
- Scope creep

---

# Core Differentiation
Không phải chat app.

Không phải health tracker.

Mà là:

“Shared caregiving continuity system.”

---

# 17. DEVELOPMENT ROADMAP

# Phase 1 — MVP
- Authentication
- Family
- Medications
- Voice notes
- Timeline
- Emergency card
- Notifications

---

# Phase 2
- Offline sync
- Documents
- Appointments
- Symptoms log

---

# Phase 3
- OCR
- AI features
- Smart summaries
- QR emergency access

---

# 18. ESTIMATED TIMELINE

## Solo Development

### MVP
2–3 tuần vibe coding.

---

### Stable Version
1–2 tháng.

---

# 19. FINAL PRODUCT POSITIONING

Kynn không phải:
- Family ERP
- Medical management software
- Chat application

---

Kynn là:

“A calm and reliable family caregiving operating system.”

