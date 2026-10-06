// ===================== CẤU HÌNH ĐỒNG BỘ POCKETSPEND =====================
// Mặc định để null = chưa bật đồng bộ, mỗi máy giữ sổ riêng.
//
// Để bật đồng bộ: dán phần cấu hình Firebase của bạn vào giữa dấu { } bên dưới,
// thay cho chữ null. Xem README.md, mục "Bật đồng bộ", Bước 5.
//
// Ví dụ sau khi dán (giá trị của bạn sẽ khác):
// window.POCKETSPEND_FIREBASE_CONFIG = {
//   apiKey: "AIzaSy...",
//   authDomain: "pocketspend-12345.firebaseapp.com",
//   projectId: "pocketspend-12345",
//   storageBucket: "pocketspend-12345.firebasestorage.app",
//   messagingSenderId: "1234567890",
//   appId: "1:1234567890:web:abc123"
// };
//
// Các giá trị này không phải mật khẩu: Google thiết kế chúng để nằm công khai trong
// web app. Thứ bảo vệ dữ liệu là Firestore Rules (chỉ 2 UID của vợ chồng được vào).

window.POCKETSPEND_FIREBASE_CONFIG = null;
