# 📚 Flashcards App - PWA

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://flashcards-pwa-navy.vercel.app/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-00C851?style=for-the-badge)](https://flashcards-pwa-navy.vercel.app/)
[![PWA](https://img.shields.io/badge/PWA-Ready-4285F4?style=for-the-badge&logo=pwa)](https://flashcards-pwa-navy.vercel.app/)

Ứng dụng học tập thông minh sử dụng thẻ ghi nhớ (flashcards) được xây dựng như một Progressive Web App (PWA).

## 🎯 Mô tả dự án

Flashcards App là một ứng dụng web tiến bộ (PWA) được thiết kế đặc biệt để giúp người Việt học tiếng Anh hiệu quả. Ứng dụng sử dụng phương pháp thẻ ghi nhớ (flashcards) kết hợp với phát âm chuẩn, giúp người dùng cải thiện từ vựng, ngữ pháp và khả năng giao tiếp tiếng Anh một cách tự nhiên.

## ✨ Tính năng chính

### 🇬🇧 Học tiếng Anh hiệu quả
- **20+ thẻ mẫu**: Từ vựng cơ bản, hội thoại hàng ngày, ngữ pháp
- **Phát âm chuẩn**: Text-to-Speech với giọng Anh-Mỹ
- **Phân loại theo chủ đề**: 13 danh mục từ cơ bản đến nâng cao
- **Học từ dễ đến khó**: Phân cấp độ khó phù hợp với trình độ
- **Thực hành đa dạng**: Học từng thẻ + Quiz trắc nghiệm

### 🃏 Quản lý thẻ ghi nhớ
- **Tạo thẻ mới**: Thêm câu hỏi và câu trả lời
- **Chỉnh sửa thẻ**: Cập nhật nội dung thẻ hiện có
- **Xóa thẻ**: Loại bỏ thẻ không cần thiết
- **Phân loại**: Tổ chức thẻ theo danh mục (Ngôn ngữ, Khoa học, Lịch sử, v.v.)
- **Tìm kiếm**: Tìm kiếm thẻ theo nội dung hoặc danh mục

### 📖 Chế độ học tập
- **Học từng thẻ**: Lật thẻ để xem câu trả lời
- **Đánh giá độ khó**: Phân loại thẻ theo mức độ dễ/trung bình/khó
- **Theo dõi tiến độ**: Thống kê số lần học và lần học cuối
- **Phím tắt**: Sử dụng phím tắt để học nhanh hơn

### 🎮 Chế độ Quiz
- **Quiz tương tác**: Câu hỏi trắc nghiệm với 4 đáp án
- **Tự động tạo đáp án sai**: Hệ thống tự động tạo các đáp án gây nhiễu
- **Theo dõi kết quả**: Hiển thị điểm số và độ chính xác
- **Làm lại quiz**: Có thể làm lại quiz nhiều lần

### 📊 Thống kê và báo cáo
- **Tổng số thẻ**: Hiển thị tổng số thẻ đã tạo
- **Đã học hôm nay**: Thống kê số thẻ đã học trong ngày
- **Lịch sử học tập**: Theo dõi tiến độ học tập của từng thẻ

## 🚀 Tính năng PWA

### 📱 Cài đặt ứng dụng
- **Installable**: Có thể cài đặt như ứng dụng native
- **Standalone mode**: Chạy độc lập không cần trình duyệt
- **App shortcuts**: Phím tắt nhanh từ màn hình chính

### 🔄 Hoạt động offline
- **Service Worker**: Cache tài nguyên để hoạt động offline
- **Offline-first**: Ưu tiên sử dụng dữ liệu đã cache
- **Background sync**: Đồng bộ dữ liệu khi có kết nối

### 🔔 Thông báo
- **Push notifications**: Thông báo nhắc nhở học tập
- **Toast messages**: Thông báo tức thì trong ứng dụng

## 🛠️ Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic và accessibility
- **CSS3**: Styling hiện đại với CSS Grid, Flexbox, và animations
- **Vanilla JavaScript**: Logic ứng dụng không phụ thuộc framework
- **Service Worker**: Xử lý cache và offline functionality
- **Web App Manifest**: Cấu hình PWA
- **Local Storage**: Lưu trữ dữ liệu local
- **Progressive Enhancement**: Hoạt động tốt trên mọi thiết bị

## 📁 Cấu trúc dự án

```
flashcards-pwa/
├── index.html          # Trang chính của ứng dụng
├── manifest.json       # Cấu hình PWA manifest
├── sw.js              # Service Worker
├── styles.css         # CSS styling
├── app.js             # JavaScript logic chính
├── icons/             # Thư mục chứa các icon PWA
│   ├── icon-16x16.png
│   ├── icon-32x32.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md          # Tài liệu dự án
```

## 🚀 Cách sử dụng

### 1. Cài đặt và chạy ứng dụng

```bash
# Clone repository
git clone <repository-url>
cd flashcards-pwa

# Chạy local server (cần HTTPS cho PWA)
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx serve .

# Hoặc sử dụng Live Server extension trong VS Code
```

### 2. Truy cập ứng dụng
- **Live Demo**: [https://flashcards-pwa-navy.vercel.app/](https://flashcards-pwa-navy.vercel.app/)
- **Local**: Mở trình duyệt và truy cập `https://localhost:8000`
- **Deploy**: Có thể deploy lên hosting service như Netlify, Vercel, GitHub Pages

### 3. Cài đặt PWA
- Trên desktop: Click vào icon "Install" trên thanh địa chỉ
- Trên mobile: Chọn "Add to Home Screen" từ menu trình duyệt

## 📱 Hướng dẫn sử dụng

### Tạo thẻ mới
1. Click nút "Thêm thẻ" trên trang chủ
2. Nhập câu hỏi vào "Mặt trước"
3. Nhập câu trả lời vào "Mặt sau"
4. Chọn danh mục phù hợp
5. Click "Lưu thẻ"

### Học tập
1. Click "Bắt đầu học tập" trên trang chủ
2. Click vào thẻ để lật xem câu trả lời
3. Đánh giá độ khó: Dễ/Trung bình/Khó
4. Tiếp tục với thẻ tiếp theo

### Chế độ Quiz
1. Click nút "Quiz" trên trang chủ
2. Đọc câu hỏi và chọn đáp án đúng
3. Xem kết quả và điểm số cuối quiz

### Phím tắt
- **Space**: Lật thẻ (trong chế độ học)
- **S**: Phát âm tiếng Anh (trong chế độ học)
- **1**: Đánh giá "Dễ"
- **2**: Đánh giá "Trung bình"
- **3**: Đánh giá "Khó"
- **Escape**: Quay lại trang trước

## 🔧 Cấu hình và tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `styles.css`:
```css
:root {
    --primary-color: #4f46e5;    /* Màu chính */
    --secondary-color: #06b6d4;  /* Màu phụ */
    --success-color: #10b981;    /* Màu thành công */
    --warning-color: #f59e0b;    /* Màu cảnh báo */
    --danger-color: #ef4444;     /* Màu lỗi */
}
```

### Thêm danh mục mới
Chỉnh sửa trong `index.html` và `app.js`:
```html
<option value="new-category">Danh mục mới</option>
```

## 📊 Dữ liệu mẫu

Ứng dụng đi kèm với 5 thẻ mẫu:
- 3 thẻ từ vựng tiếng Anh
- 1 thẻ về JavaScript
- 1 thẻ toán học cơ bản

## 🔒 Bảo mật và quyền riêng tư

- **Dữ liệu local**: Tất cả dữ liệu được lưu trữ local trên thiết bị
- **Không thu thập thông tin**: Ứng dụng không thu thập dữ liệu cá nhân
- **HTTPS**: Yêu cầu HTTPS để hoạt động như PWA
- **Offline-first**: Hoạt động hoàn toàn offline

## 🐛 Xử lý lỗi

### Lỗi thường gặp
1. **Service Worker không hoạt động**: Đảm bảo chạy trên HTTPS
2. **Icon không hiển thị**: Kiểm tra đường dẫn icon trong manifest.json
3. **Dữ liệu bị mất**: Dữ liệu được lưu trong Local Storage của trình duyệt

### Debug
- Mở Developer Tools (F12)
- Kiểm tra Console tab để xem lỗi
- Kiểm tra Application tab để xem Service Worker và Local Storage

## 🚀 Triển khai

### 🌐 Live Demo
**Ứng dụng đã được deploy và có thể truy cập tại:**
- **Vercel**: [https://flashcards-pwa-navy.vercel.app/](https://flashcards-pwa-navy.vercel.app/)
- **GitHub Repository**: [https://github.com/conanWinner/flashcards-pwa](https://github.com/conanWinner/flashcards-pwa)

### GitHub Pages
1. Push code lên GitHub repository
2. Vào Settings > Pages
3. Chọn source branch
4. Truy cập `https://username.github.io/repository-name`

### Netlify
1. Kết nối GitHub repository với Netlify
2. Deploy tự động khi push code
3. Truy cập URL được cung cấp

### Vercel (Đã triển khai)
1. Import project từ GitHub
2. Deploy tự động
3. Truy cập URL được cung cấp

## 📈 Tính năng tương lai

- [ ] Đồng bộ dữ liệu giữa các thiết bị
- [ ] Chia sẻ bộ thẻ với người khác
- [ ] Thêm hình ảnh vào thẻ
- [ ] Chế độ học tập theo thuật toán Spaced Repetition
- [ ] Thống kê chi tiết và biểu đồ
- [ ] Xuất/nhập dữ liệu
- [ ] Chế độ học tập nhóm
- [ ] Tích hợp API từ điển

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm thông tin.

## 👨‍💻 Tác giả

**Sinh viên**: Đoàn Quang Thắng
**MSSV**: 22IT272
**Lớp**: 22SE2

## 📞 Liên hệ

- Email: thangqd.22it@vku.udn.vn
- GitHub: https://github.com/conanWinner

---

**Lưu ý**: Đây là dự án học tập được phát triển cho mục đích giáo dục. Ứng dụng hoạt động hoàn toàn offline và không thu thập dữ liệu người dùng.
