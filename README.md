# Kynn — Family Health OS

🇻🇳 [Tiếng Việt](#kynn--family-health-os-tiếng-việt) | 🇬🇧 [English](#kynn--family-health-os-english)

---

# Kynn — Family Health OS (Tiếng Việt)
> **Keep Your Next of Kin Near — Giữ gia đình luôn kết nối**

## 1. Giới thiệu dự án
Kynn là một hệ thống phối hợp chăm sóc sức khỏe gia đình tập trung, được thiết kế để hỗ trợ việc chăm sóc ông bà, cha mẹ, người bệnh nền và trẻ nhỏ. Ứng dụng tập trung giải quyết bài toán phối hợp liên tục giữa các thành viên trong gia đình mà các ứng dụng chat thông thường (như Zalo, Messenger) không đáp ứng được do trôi tin nhắn và thiếu ngữ cảnh.

### Vấn đề thực tế
* **Mất ngữ cảnh (Context Loss):** Thông tin toa thuốc, lịch khám được chia sẻ qua chat thường bị trôi, khó tìm lại.
* **Quên thuốc:** Người lớn tuổi dễ quên lịch uống thuốc hoặc uống trùng liều nếu không có sự theo dõi sát sao hoặc xác nhận thời gian thực từ người thân.
* **Khó khăn khi chia ca chăm sóc:** Thiếu lịch trình rõ ràng và tình trạng thực tế để các thành viên thay ca.
* **Xử lý tình huống khẩn cấp:** Không có nơi lưu trữ thông tin sức khỏe quan trọng như nhóm máu, dị ứng để tiếp cận ngay lập tức khi khẩn cấp.
* **Phụ thuộc:** Việc chăm sóc thường dồn lên một người duy nhất trong nhà chịu trách nhiệm chính.

### Giải pháp của Kynn
* **Hệ thống chăm sóc tập trung:** Mọi thành viên cùng theo dõi và phối hợp trên một Dashboard chung.
* **Trạng thái thuốc Realtime:** Biết ngay ai đã uống thuốc, ai chưa, hoặc ai đã bỏ lỡ liều.
* **Timeline chăm sóc trực quan:** Dòng thời gian cập nhật liên tục mọi hoạt động từ uống thuốc, triệu chứng, đến lịch khám theo thời gian thực.
* **Hồ sơ khẩn cấp (Emergency Card):** Truy cập nhanh thông tin y tế quan trọng (nhóm máu, dị ứng, thuốc hiện tại) ngay cả khi offline với thiết kế chữ lớn, rõ ràng.
* **Hướng dẫn bằng giọng nói (Voice Instructions):** Ghi âm hướng dẫn nhanh để người thân (nhất là người lớn tuổi) dễ nghe và thực hiện.
* **Nhắc nhở Offline (Offline Reminders):** Hoạt động ổn định bất kể điều kiện mạng.

---

## 2. Tính năng chính
* **Quản lý Gia đình & Thành viên:** Tạo nhóm gia đình, mời thành viên qua mã Code/QR Code, thiết lập hồ sơ chi tiết cho từng thành viên (ông, bà, ba, mẹ...).
* **Hồ sơ sức khỏe (Health Profile):** Quản lý nhóm máu, tiền sử bệnh dị ứng, bệnh nền, thông tin liên hệ khẩn cấp.
* **Quản lý & Nhắc nhở uống thuốc (Medication Management):** Lên lịch uống thuốc, ghi nhận lịch sử uống thuốc (Đã uống, Chưa uống, Bỏ lỡ), nhắc nhở cục bộ (local notifications) offline và push notifications online.
* **Hướng dẫn giọng nói (Voice Care Instructions):** Cho phép ghi âm và phát lại các chỉ dẫn uống thuốc hoặc dặn dò chăm sóc nhanh.
* **Timeline hoạt động Realtime:** Dòng thời gian cập nhật liên tục mọi thay đổi trạng thái sức khỏe, lịch uống thuốc bằng Socket.IO.
* **Hồ sơ khẩn cấp (Emergency Card):** Hiển thị trực quan chữ lớn, hỗ trợ truy cập offline các thông tin sống còn: nhóm máu, dị ứng, thuốc đang dùng, liên hệ khẩn cấp, BHYT.
* **Lưu trữ tài liệu y tế (Medical Documents):** Đăng tải, lưu trữ hình ảnh hoặc file PDF toa thuốc, kết quả xét nghiệm, CCCD, BHYT với bảo mật Cloudinary.
* **Theo dõi triệu chứng (Symptoms Log):** Ghi nhận nhanh các triệu chứng phát sinh (ho, sốt, đau đầu, chóng mặt...) và theo dõi diễn biến.
* **Lịch khám bệnh (Appointments):** Lên lịch hẹn khám, nhắc lịch khám và lưu trữ kết quả chẩn đoán của bác sĩ.
* **Chế độ Offline (Offline-First):** Lưu trữ dữ liệu cục bộ bằng SQLite và tự động đồng bộ hóa lên server thông qua hàng đợi đồng bộ khi kết nối internet được khôi phục.

---

## 3. Công nghệ sử dụng
### Frontend (Mobile App)
* **Framework:** React Native + Expo
* **Ngôn ngữ:** TypeScript
* **State Management:** Zustand, React Query
* **Navigation:** React Navigation
* **Local Database:** SQLite (lưu trữ và cache dữ liệu offline)
* **Audio:** expo-av, expo-audio
* **Form & Validation:** React Hook Form + Zod
* **Notifications:** expo-notifications

### Backend (API Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Realtime Communication:** Socket.IO
* **Authentication:** JWT (JSON Web Token), Google OAuth 2.0
* **File Upload:** Multer & Cloudinary
* **Jobs Scheduling:** Node-cron (dành cho các tác vụ kiểm tra & dọn dẹp định kỳ)

---

## 4. Cấu trúc thư mục dự án
Hệ thống được tổ chức dạng Monorepo tách biệt Frontend và Backend:

### Backend Structure (MVC)
```txt
backend/
├── src/
│   ├── config/              # Cấu hình DB, Environment, Socket, Cloudinary
│   ├── middleware/          # Auth, Upload, Error handling, Role middleware
│   ├── modules/             # Các mô-đun chức năng (Controller, Service, Model, Routes)
│   │   ├── appointment/     # Quản lý lịch hẹn khám
│   │   ├── auth/            # Xác thực người dùng (User & Auth)
│   │   ├── document/        # Quản lý hồ sơ, tài liệu y tế
│   │   ├── emergency/       # Thông tin khẩn cấp
│   │   ├── family/          # Quản lý nhóm gia đình
│   │   ├── medication/      # Quản lý thuốc & lịch sử uống thuốc
│   │   ├── member/          # Thông tin thành viên & hồ sơ sức khỏe
│   │   ├── notification/    # Xử lý thông báo
│   │   ├── timeline/        # Timeline hoạt động & Socket.IO
│   │   └── voice/           # Ghi âm hướng dẫn chăm sóc
│   ├── sockets/             # File cấu hình Socket.IO tập trung
│   ├── jobs/                # Các tác vụ chạy ngầm định kỳ
│   ├── utils/               # Hàm tiện ích (Logger, token generator, responses)
│   ├── app.js               # Khởi tạo ứng dụng Express
│   └── server.js            # Khởi chạy Socket.IO & Web Server
├── uploads/                 # Thư mục lưu trữ tạm thời cho file upload
├── .env                     # File biến môi trường mẫu
└── package.json
```

### Frontend Structure
```txt
frontend/
├── src/
│   ├── api/                 # Các API client (Axios configuration & endpoints)
│   ├── components/          # Components dùng chung (Cards, Modals, Inputs...)
│   │   ├── cards/           # MedicationCard, DocumentCard, TimelineItem...
│   │   └── common/          # CustomInput, Buttons...
│   ├── constants/           # Hằng số (Colors, Fonts, Spacing, Routes)
│   ├── navigation/          # Cấu hình luồng điều hướng (App & Auth navigator)
│   ├── screens/             # Các màn hình chức năng chính
│   │   ├── auth/            # Đăng nhập & Đăng ký
│   │   ├── home/            # Dashboard chính
│   │   ├── medication/      # Quản lý danh sách thuốc & lịch hẹn
│   │   ├── documents/       # Lưu trữ kết quả khám & BHYT
│   │   ├── emergency/       # Màn hình khẩn cấp (Emergency Card)
│   │   ├── timeline/        # Dòng thời gian hoạt động gia đình
│   │   ├── family/          # Thành viên gia đình & Quản lý nhóm
│   │   └── profile/         # Hồ sơ cá nhân
│   ├── services/            # Xử lý Socket, Notifications, Sync, Storage
│   ├── store/               # Zustand state stores (Auth, Family, Medication, Timeline, Appointment, Sync)
│   ├── types/               # Type definitions trong TypeScript
│   └── main.tsx             # Điểm khởi chạy của Expo
├── App.tsx                  # File gốc chứa Navigator & Provider
├── tsconfig.json
└── package.json
```

---

## 5. Thiết kế Cơ sở dữ liệu (Database Schema)
Hệ thống sử dụng MongoDB làm database chính với các collection sau:

* **users:** Thông tin tài khoản người dùng (email, tên, avatar, OAuth provider).
* **families:** Thông tin nhóm gia đình (tên gia đình, mã mời `inviteCode`, chủ nhóm `ownerId`).
* **members:** Hồ sơ chi tiết của thành viên gia đình (bao gồm nhóm máu, dị ứng, bệnh nền, liên hệ khẩn cấp).
* **medications:** Danh sách thuốc của thành viên, lịch trình và ghi chú.
* **medication_logs:** Nhật ký uống thuốc thực tế (trạng thái: taken/missed, người xác nhận, thời gian).
* **voice_notes:** Lưu thông tin audio hướng dẫn uống thuốc (URL Cloudinary, bản dịch text).
* **documents:** Hồ sơ y tế, toa thuốc, kết quả xét nghiệm lưu trữ trên Cloudinary.
* **activities:** Nhật ký hoạt động chung hiển thị trên Timeline.
* **appointments:** Lịch khám bệnh, bác sĩ điều trị và ghi chú.
* **notifications:** Quản lý danh sách thông báo gửi cho người dùng.

---

## 6. Hướng dẫn chạy dự án

### Yêu cầu hệ thống
* Node.js (phiên bản v18 trở lên)
* MongoDB (đang chạy cục bộ hoặc MongoDB Atlas)
* Expo CLI cài đặt toàn cục (`npm install -g expo-cli`) hoặc chạy trực tiếp qua `npx`

### 1. Cài đặt và Khởi chạy Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file `.env` ở thư mục `backend/` tương tự như sau:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/kynn
   JWT_SECRET=kynn_super_secret_key
   JWT_EXPIRES_IN=7d

   # Cấu hình Cloudinary (Dành cho tính năng upload hồ sơ y tế)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Chạy Backend ở chế độ Development:
   ```bash
   npm run dev
   ```
   *Server sẽ khởi chạy tại: `http://localhost:5000`*

### 2. Cài đặt và Khởi chạy Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. **Cấu hình IP API:** Mở file `frontend/src/api/axios.ts` và thay đổi IP của biến `API_URL` thành địa chỉ IP máy cục bộ của bạn (Local IP LAN) để thiết bị/giả lập Android hoặc iOS có thể kết nối được:
   ```typescript
   const API_URL = 'http://<YOUR_LOCAL_IP>:5000/api/v1';
   ```
4. Khởi chạy Expo:
   ```bash
   npx expo start
   ```
5. Dùng ứng dụng **Expo Go** trên điện thoại để quét mã QR hoặc mở trình giả lập (Android Emulator / iOS Simulator) bằng cách nhấn phím tương ứng (`a` cho Android, `i` cho iOS).

---

# Kynn — Family Health OS (English)
> **Keep Your Next of Kin Near — Keeping Families Connected**

## 1. Project Introduction
Kynn is a centralized family health coordination operating system designed to support caregiving for grandparents, parents, patients with chronic conditions, and children. The application resolves the critical problem of coordination continuity among family members, which is often lost in traditional messaging apps (such as Zalo or Messenger) due to chat fragmentation and lack of structured context.

### Real-World Problems
* **Context Loss:** Medication schedules, prescription photos, and doctor appointments shared via chat quickly get buried and are hard to retrieve.
* **Missed Medications:** Elderly family members might forget to take their pills or accidentally double-dose if there is no real-time coordination and logging among caregivers.
* **Handover Friction:** Handing over caregiving shifts between family members is complex without shared progress tracking.
* **Emergency Preparedness:** Lack of a single source of truth for vital medical information (blood type, allergies, emergency contacts) during critical moments.
* **Sole Caregiver Burnout:** Caregiving responsibility often falls heavily on a single family member.

### Kynn's Solutions
* **Centralized Family Dashboard:** All members view and collaborate on the same family health workspace.
* **Real-time Medication Status:** Instantly track who has taken their medicine, who missed it, or who is scheduled next.
* **Interactive Care Timeline:** A real-time log tracking every health activity, symptom, voice note, and doctor appointment.
* **Emergency Card:** A bold, high-contrast, offline-accessible layout featuring essential life-saving details.
* **Voice Instructions:** Record and attach voice notes to let elderly family members hear care instructions from their loved ones' voices.
* **Offline Reminders:** Local alarms and notifications that run reliably regardless of network status.

---

## 2. Key Features
* **Family & Profile Management:** Create a family workspace, invite members via invite code or QR code, and customize profiles for parents, grandparents, etc.
* **Health Profiles:** Track blood types, allergies, chronic conditions, medical history, and emergency contacts.
* **Medication Management:** Add/edit/delete medications, create recurring dosing schedules, log adherence (Taken, Missed, Pending), and set up local offline reminders or remote push notifications.
* **Voice Care Notes:** Record, store, and play voice instructions linked to specific medications or profiles.
* **Real-time Activity Timeline:** Continuously updated stream of all family care events powered by Socket.IO.
* **Offline-First Emergency Card:** Bold typography displaying blood type, active medications, allergies, and emergency contacts with fully offline access.
* **Medical Document Storage:** Securely upload, preview, and download images or PDFs of prescriptions, lab test results, and health insurance cards.
* **Symptom Logging:** Track active symptoms (fever, cough, headache) and log changes over time.
* **Medical Appointments:** Schedule hospital visits, set reminders, and log diagnosis results.
* **Offline Syncing:** Offline modifications are stored locally in SQLite and synchronized automatically in the background when the device goes back online.

---

## 3. Tech Stack
### Frontend (Mobile App)
* **Framework:** React Native + Expo
* **Language:** TypeScript
* **State Management:** Zustand, React Query
* **Navigation:** React Navigation
* **Local Database:** SQLite (offline cache & local storage)
* **Audio:** expo-av, expo-audio
* **Forms & Validation:** React Hook Form + Zod
* **Notifications:** expo-notifications

### Backend (API Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Real-time Communication:** Socket.IO
* **Authentication:** JWT (JSON Web Token), Google OAuth 2.0
* **File Upload:** Multer & Cloudinary
* **Background Jobs:** Node-cron

---

## 4. Project Directory Structure
The project is organized as a Monorepo split into frontend and backend:

### Backend Structure (MVC)
```txt
backend/
├── src/
│   ├── config/              # Database, Environment, Socket, Cloudinary settings
│   ├── middleware/          # Auth, Upload, Error handling, Role middleware
│   ├── modules/             # Function modules (Controller, Service, Model, Routes)
│   │   ├── appointment/     # Hospital visit appointment management
│   │   ├── auth/            # User authentication (User & Auth)
│   │   ├── document/        # Document & health record management
│   │   ├── emergency/       # Emergency card information
│   │   ├── family/          # Family circle management
│   │   ├── medication/      # Medication & logs tracking
│   │   ├── member/          # Family member profiles & health information
│   │   ├── notification/    # Notifications processing
│   │   ├── timeline/        # Care activities timeline & Socket.IO
│   │   └── voice/           # Voice notes recording & playback
│   ├── sockets/             # Concentrated Socket.IO configurations
│   ├── jobs/                # Cron background jobs
│   ├── utils/               # Utility functions (Logger, token generator, responses)
│   ├── app.js               # Initialize Express app
│   └── server.js            # Start Socket.IO & Web Server
├── uploads/                 # Temporary directory for uploads
├── .env                     # Environment variables template
└── package.json
```

### Frontend Structure
```txt
frontend/
├── src/
│   ├── api/                 # API clients (Axios configuration & endpoints)
│   ├── components/          # Reusable UI components
│   │   ├── cards/           # MedicationCard, DocumentCard, TimelineItem...
│   │   └── common/          # CustomInput, Buttons...
│   ├── constants/           # Style guides & constants (Colors, Fonts, Spacing, Routes)
│   ├── navigation/          # Navigation flows (App & Auth navigator)
│   ├── screens/             # Screen views
│   │   ├── auth/            # Login & Register screens
│   │   ├── home/            # Primary Dashboard
│   │   ├── medication/      # Medications list & scheduling screens
│   │   ├── documents/       # Prescriptions, test results, cards archive
│   │   ├── emergency/       # Offline-first emergency card view
│   │   ├── timeline/        # Real-time activity logs view
│   │   ├── family/          # Family settings & members management
│   │   └── profile/         # Personal profile settings
│   ├── services/            # Client Socket, Notifications, Sync, Storage services
│   ├── store/               # Zustand global state stores
│   ├── types/               # Type definitions in TypeScript
│   └── main.tsx             # Expo entry initialization point
├── App.tsx                  # Root file containing Providers & Navigation Containers
├── tsconfig.json
└── package.json
```

---

## 5. Database Schema
The system uses MongoDB as the primary database with the following collections:
* **users:** User account credentials and profiles.
* **families:** Family circles/groups with `inviteCode` and `ownerId`.
* **members:** Detailed health profiles for each family member.
* **medications:** Scheduled prescriptions, dosages, and notes.
* **medication_logs:** Historical records of medication adherence.
* **voice_notes:** Audio guidance notes linked to medications or members.
* **documents:** Stored medical files (prescriptions, results) on Cloudinary.
* **activities:** Stream of events displaying on the family Care Timeline.
* **appointments:** Scheduled medical visits and doctor notes.
* **notifications:** User notifications log.

---

## 6. Getting Started & Installation

### Prerequisites
* Node.js (v18 or higher)
* Local MongoDB instance or MongoDB Atlas
* Expo CLI (`npm install -g expo-cli` or run through `npx`)

### 1. Backend Setup & Startup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/kynn
   JWT_SECRET=kynn_super_secret_key
   JWT_EXPIRES_IN=7d

   # Cloudinary configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start backend in development mode:
   ```bash
   npm run dev
   ```
   *The server runs at: `http://localhost:5000`*

### 2. Frontend Setup & Startup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Configure API IP:** Open `frontend/src/api/axios.ts` and replace `API_URL` with your local development machine LAN IP address so simulators and physical devices can connect:
   ```typescript
   const API_URL = 'http://<YOUR_LOCAL_IP>:5000/api/v1';
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. Use the **Expo Go** app on your physical iOS/Android device to scan the QR code, or open the app inside an emulator/simulator by pressing `a` (Android) or `i` (iOS).