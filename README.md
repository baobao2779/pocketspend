# PocketSpend — Hướng dẫn cài đặt

Sổ chi tiêu hằng ngày cho gia đình. Web app chạy trên iPhone, Windows và Mac, không cần cài từ App Store, không mất phí.

## Trong thư mục này có gì

| File | Dùng để làm gì |
|---|---|
| `index.html` | Toàn bộ app (giao diện + xử lý dữ liệu) |
| `firebase-config.js` | Nơi dán cấu hình Firebase để bật đồng bộ (mặc định chưa bật) |
| `pocket-cloud.js` | Thư viện Firebase đã đóng gói sẵn, chỉ tải khi bật đồng bộ |
| `firestore.rules` | Quy tắc bảo mật dán vào Firebase: chỉ 2 vợ chồng được vào sổ |
| `manifest.webmanifest`, `sw.js` | Cho iPhone thêm app vào màn hình chính và mở được khi mất mạng |
| `icon-*.png` | Icon của app |

## Bản 2 có gì

Tất cả chức năng của bản 1: thêm/sửa/xóa khoản chi, 9 danh mục, người chi (Sang / Vợ / Gia đình), tổng hôm nay và theo tháng, ngân sách từng tháng có cảnh báo, biểu đồ theo danh mục, lịch sử có tìm kiếm và lọc, xuất CSV, sao lưu/khôi phục JSON. Tiền tính bằng số nguyên cents nên không sai số làm tròn.

**Mới: đồng bộ hai điện thoại.** Khi đã bật (làm theo phần "Bật đồng bộ" bên dưới), Sang và Vợ đăng nhập trên iPhone riêng và dùng chung một sổ. Thêm, sửa, xóa trên máy này hiện trên máy kia sau vài giây. Mất mạng vẫn nhập được, app tự gửi khi có mạng lại. Góc trên bên phải luôn cho biết trạng thái: **Đã đồng bộ**, **Đang gửi…**, **Mất mạng**, **Lỗi đồng bộ** hoặc **Chỉ trên máy này** (chưa đăng nhập).

Nếu chưa bật đồng bộ, app chạy y như bản 1: mỗi máy một sổ riêng.

**Lưu ý khi hai người cùng sửa một khoản chi gần như cùng lúc:** lần lưu sau cùng sẽ được giữ. Hai người thêm hoặc sửa các khoản *khác nhau* cùng lúc thì không mất gì.

---

## Cách 1: Đưa app lên mạng bằng GitHub Pages (miễn phí, khuyên dùng)

Làm một lần trên máy tính Windows hoặc Mac, khoảng 10 phút.

### Bước 1 — Tạo tài khoản GitHub
1. Vào **github.com** → bấm **Sign up** → làm theo hướng dẫn (dùng email của bạn, gói Free).

### Bước 2 — Tạo kho chứa (repository)
1. Đăng nhập GitHub → bấm dấu **+** góc trên bên phải → **New repository**.
2. **Repository name:** gõ `pocketspend`.
3. Chọn **Public**. (GitHub Pages miễn phí yêu cầu kho Public. Kho chỉ chứa mã của app, **không chứa dữ liệu chi tiêu** của bạn — dữ liệu nằm trong điện thoại.)
4. Bấm **Create repository**.

### Bước 3 — Tải các file lên
1. Trong trang kho vừa tạo, bấm dòng chữ **uploading an existing file**.
2. Giải nén file `pocketspend.zip`, kéo **tất cả các file bên trong** (index.html, manifest.webmanifest, sw.js, 3 file icon, README.md) vào trang. Kéo các file, không kéo thư mục.
3. Bấm **Commit changes**.

### Bước 4 — Bật GitHub Pages
1. Trong kho, bấm tab **Settings** → mục **Pages** ở cột trái.
2. Phần **Branch**: chọn `main`, thư mục `/ (root)` → bấm **Save**.
3. Đợi 1–2 phút, tải lại trang. Phía trên sẽ hiện link dạng:
   `https://TEN-GITHUB-CUA-BAN.github.io/pocketspend/`

### Bước 5 — Thêm vào màn hình chính iPhone
1. Trên iPhone, mở **Safari** (phải là Safari) → vào link ở bước 4.
2. Bấm nút **Chia sẻ** (ô vuông có mũi tên lên) → kéo xuống chọn **Thêm vào MH chính** (Add to Home Screen) → **Thêm**.
3. Từ giờ mở PocketSpend bằng icon trên màn hình chính, **không mở bằng Safari**. Lý do: dữ liệu của app mở từ màn hình chính được iPhone giữ riêng; nếu chỉ mở trong tab Safari mà bỏ không dùng lâu, Safari có thể xóa dữ liệu.
4. Vào **Cài đặt** trong app → chọn **Người chi mặc định** là tên của người dùng máy đó (máy Vợ chọn "Vợ").

Vợ làm lại bước 5 trên iPhone của Vợ với cùng link.

### Cập nhật app sau này
Khi có bản mới: vào kho trên GitHub → **Add file → Upload files** → kéo file `index.html` mới vào → **Commit changes**. Dữ liệu trên điện thoại không bị ảnh hưởng. Đóng hẳn app trên iPhone rồi mở lại (có thể cần mở 2 lần) để nhận bản mới.

**Đã bật đồng bộ rồi thì khi cập nhật, đừng tải đè `firebase-config.js`**, vì file mới sẽ đưa cấu hình về `null` và tắt đồng bộ. Nếu lỡ ghi đè, chỉ cần làm lại Bước 6 của phần Bật đồng bộ.

---

## Bật đồng bộ hai điện thoại (Firebase, gói miễn phí)

Làm một lần trên máy tính, khoảng 20–30 phút. Cần một tài khoản Google (Gmail). Mình (Claude) không tạo tài khoản hay đăng ký gì thay bạn.

### Chi phí
Firebase có gói **Spark** miễn phí, không cần thẻ thanh toán. Khi vượt hạn mức, Firebase tạm dừng dịch vụ đó tới hôm sau chứ **không tự trừ tiền**. Hạn mức Firestore của Spark (theo trang giá Firebase lúc viết): 50.000 lượt đọc/ngày, 20.000 lượt ghi/ngày, 1 GiB dữ liệu. App lưu mỗi tháng thành một bản ghi, nên mỗi lần mở app chỉ tốn vài chục lượt đọc; hai vợ chồng dùng cả ngày cũng chỉ vài nghìn lượt. Google có thể đổi chính sách sau này, nên **đừng bấm nâng cấp lên gói Blaze** nếu không chắc.

### Bước 0 — Cập nhật file trên GitHub
Vào kho `pocketspend` trên GitHub → **Add file → Upload files** → kéo **tất cả** file trong thư mục này vào (ghi đè file cũ) → **Commit changes**.

### Bước 1 — Tạo project Firebase
1. Vào **console.firebase.google.com**, đăng nhập bằng tài khoản Google.
2. Bấm **Create a project** (hoặc **Add project**) → đặt tên `pocketspend` → Continue.
3. Màn hình hỏi về **Google Analytics**: tắt đi (không cần) → **Create project** → đợi xong → **Continue**.

### Bước 2 — Bật đăng nhập bằng Email/Password
1. Ở menu trái, tìm **Authentication** (có thể nằm trong nhóm **Build** hoặc **Security**) → **Get started**.
2. Tab **Sign-in method** → chọn **Email/Password** → bật công tắc đầu tiên (**Email/Password**). Để tắt công tắc **Email link**. → **Save**.

### Bước 3 — Tạo tài khoản cho hai vợ chồng
1. Vẫn trong Authentication → tab **Users** → **Add user**.
2. Nhập email và mật khẩu (ít nhất 6 ký tự) cho Sang → **Add user**. Làm lại cho Vợ.
3. Trong danh sách Users, cột **User UID** là một chuỗi dài kiểu `Xy3k9...`. Bấm vào để sao chép UID của **từng người**, dán tạm vào Notes. Bước 7 cần dùng.

App không có nút đăng ký, nên chỉ những tài khoản bạn tạo ở đây mới đăng nhập được.

### Bước 4 — Tạo cơ sở dữ liệu Firestore
1. Menu trái → **Databases & Storage** (hoặc **Build**) → **Firestore** → **Create database**.
2. Nếu được hỏi chọn edition, chọn **Standard**.
3. **Location**: chọn một vị trí ở Mỹ, ví dụ `nam5 (United States)`. Không đổi được sau khi tạo.
4. Chọn **Production mode** (khóa hết, bước 7 sẽ mở cho 2 vợ chồng) → **Create**.

### Bước 5 — Lấy cấu hình web
1. Bấm biểu tượng **bánh răng** cạnh "Project Overview" → **Project settings**.
2. Kéo xuống **Your apps** → bấm biểu tượng **`</>`** (Web).
3. **App nickname**: `PocketSpend`. **Không** tích Firebase Hosting → **Register app**.
4. Màn hình hiện một đoạn code có `const firebaseConfig = { ... };`. Sao chép phần **từ dấu `{` đến dấu `}`** (gồm apiKey, authDomain, projectId…).

### Bước 6 — Dán cấu hình vào GitHub
1. Vào kho `pocketspend` trên GitHub → bấm file **`firebase-config.js`** → bấm biểu tượng **bút chì** (Edit).
2. Ở dòng cuối, thay chữ `null` bằng phần `{ ... }` vừa sao chép, giữ dấu `;` ở cuối. Kết quả giống ví dụ trong file:
   ```js
   window.POCKETSPEND_FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "pocketspend-xxxxx.firebaseapp.com",
     projectId: "pocketspend-xxxxx",
     storageBucket: "pocketspend-xxxxx.firebasestorage.app",
     messagingSenderId: "...",
     appId: "1:...:web:..."
   };
   ```
3. Bấm **Commit changes**.

Các giá trị này không phải mật khẩu. Google thiết kế để chúng nằm công khai trong web app; thứ bảo vệ dữ liệu là quy tắc ở bước 7.

### Bước 7 — Dán quy tắc bảo mật (quan trọng)
1. Firebase → **Firestore** → tab **Rules**.
2. Xóa hết nội dung đang có. Mở file **`firestore.rules`** (bằng Notepad/TextEdit), sao chép toàn bộ, dán vào.
3. Thay `UID_CUA_SANG` và `UID_CUA_VO` bằng hai UID ở bước 3 (giữ nguyên dấu nháy đơn `'...'`).
4. Bấm **Publish**.

Nếu quên bước này hoặc dán sai UID, app sẽ báo **"Tài khoản này chưa được cấp quyền vào sổ chung"**. UID của mỗi người cũng hiện trong app ở **Cài đặt → Đồng bộ** sau khi đăng nhập, có nút Sao chép.

### Bước 8 — Đăng nhập trên điện thoại
1. Trên iPhone, đóng hẳn PocketSpend (vuốt lên khỏi danh sách app) rồi mở lại. Có thể cần làm 2 lần để nhận bản mới.
2. **Cài đặt → Đồng bộ hai điện thoại** → nhập email, mật khẩu → **Đăng nhập**.
3. Nếu máy đã có khoản chi nhập từ bản 1, app hỏi **"Chuyển dữ liệu cũ lên sổ chung?"** → chọn **Chuyển lên**. Dữ liệu cũ trên máy vẫn được giữ làm bản dự phòng.
4. Vợ làm tương tự trên máy của Vợ bằng tài khoản của Vợ.
5. Thử: Sang thêm một khoản chi, xem máy Vợ có hiện sau vài giây không. Chip góc trên phải nên là **Đã đồng bộ**.

### Khi đã đồng bộ, cần biết
- **Xóa, Khôi phục → Thay thế, Xóa toàn bộ sổ chung** ảnh hưởng **cả hai điện thoại**. App sẽ nhắc rõ trước khi làm.
- **Đăng xuất** đưa máy về sổ riêng cũ và xóa bản lưu tạm của sổ chung trên máy đó. Sổ chung trên Firebase không bị ảnh hưởng.
- **Quên mật khẩu:** màn hình đăng nhập có nút "Quên mật khẩu?", Firebase sẽ gửi email đặt lại (xem cả thư mục Spam). Hoặc Sang đổi trong Firebase → Authentication → Users.
- Vẫn nên **xuất bản sao lưu JSON** mỗi tháng một lần, phòng khi lỡ xóa nhầm.

---

## Cách 2: Chạy thử trên máy tính (không cần mạng)

**Windows hoặc Mac:** nhấp đúp vào `index.html` → mở bằng Chrome, Edge hoặc Safari. Dùng được đầy đủ, chỉ không có chế độ chạy offline của service worker. Cách này luôn dùng sổ riêng; đồng bộ chỉ dùng qua link GitHub Pages. Dữ liệu ở cách này nằm trong trình duyệt của máy tính, tách biệt với điện thoại.

---

## Sao lưu — nên làm mỗi 1–2 tuần

Khi chưa bật đồng bộ, dữ liệu chỉ nằm trong điện thoại. Nếu mất máy, xóa app, hoặc xóa dữ liệu Safari thì mất sổ. App sẽ nhắc trong màn hình **Cài đặt** nếu đã 14 ngày chưa sao lưu.

1. **Cài đặt → Xuất bản sao lưu (JSON)**.
2. Trên iPhone sẽ hiện bảng chia sẻ → chọn **Lưu vào Tệp** (Save to Files) → chọn **iCloud Drive** → **Lưu**.

**Khôi phục:** Cài đặt → **Khôi phục từ bản sao lưu…** → chọn file JSON. App sẽ cho xem trước số khoản chi trong file và **chưa thay đổi gì** cho đến khi bạn chọn:
- **Gộp:** chỉ thêm các khoản chưa có, giữ nguyên dữ liệu hiện tại.
- **Thay thế toàn bộ:** phải gõ `THAY THẾ` để xác nhận. Có thể **hoàn tác một lần** trong Cài đặt.

## Xuất CSV cho Excel

Cài đặt → **CSV tháng …** hoặc **CSV tất cả khoản chi**. File có dấu tiếng Việt đúng khi mở bằng Excel. Ghi chú bắt đầu bằng `=`, `+`, `-`, `@` sẽ được thêm dấu `'` phía trước để Excel không hiểu nhầm thành công thức.

## Câu hỏi thường gặp

**Có tốn tiền không?** GitHub Pages hiện miễn phí cho kho Public. GitHub có thể thay đổi chính sách; nếu vậy bạn vẫn có bản sao lưu JSON và có thể chuyển sang nơi host khác.

**Dữ liệu có bị gửi lên mạng không?** Khi chưa bật đồng bộ: không, dữ liệu chỉ nằm trong điện thoại. Khi bật đồng bộ: dữ liệu nằm trong project Firebase của chính bạn, chỉ 2 tài khoản trong Rules đọc được. Link GitHub chỉ phục vụ file giao diện, không chứa dữ liệu. Font chữ được tải từ Google Fonts; nếu không có mạng app dùng font hệ thống.

**Điện thoại hết pin / khởi động lại có mất dữ liệu không?** Không. Dữ liệu được lưu ngay mỗi khi bấm Lưu.
