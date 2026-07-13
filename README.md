# Hệ Thống Quản Lý Đặt Tiệc Cưới Nhà Hàng - Royal Wedding

Hệ thống quản lý đặt tiệc cưới nhà hàng cao cấp được phát triển dựa trên cấu trúc cơ sở dữ liệu có sẵn từ file `DB_Quanlytieccuoi.docx`.

Ứng dụng được xây dựng trên mô hình Client-Server hiện đại:
- **Backend (API)**: Sử dụng Node.js & Express, lưu trữ dữ liệu dạng file JSON cục bộ (`db.json`) có cơ chế mô phỏng khóa ngoại, giúp bạn có thể khởi chạy và lưu trữ dữ liệu tức thì mà không cần cài đặt các máy chủ cơ sở dữ liệu lớn hay biên dịch thư viện trên Windows.
- **Frontend (Giao diện)**: Sử dụng Single Page Application (SPA) viết bằng HTML5, CSS3 Glassmorphism sang trọng và JavaScript thuần (ES6+), tích hợp biểu đồ Chart.js và thư viện Remix Icon.

---

## 🛠️ Hướng dẫn cài đặt & Chạy ứng dụng nhanh

Để chạy ứng dụng ngay trong Visual Studio Code, hãy thực hiện theo các bước sau:

1. **Mở thư mục dự án trong VS Code**:
   Mở phần mềm **Visual Studio Code**, bấm `File` -> `Open Folder...` và chọn thư mục `QuanLyNhaHangTiecCuoi`.

2. **Mở Terminal trong VS Code**:
   Bấm tổ hợp phím `Ctrl + \`` (hoặc vào menu `Terminal` -> `New Terminal`).

3. **Cài đặt các thư viện phụ thuộc**:
   Trong cửa sổ Terminal, nhập lệnh sau và nhấn **Enter**:
   ```bash
   npm install
   ```

4. **Khởi chạy ứng dụng**:
   Sau khi cài đặt xong, khởi chạy server bằng lệnh:
   ```bash
   npm start
   ```

5. **Truy cập ứng dụng**:
   Mở trình duyệt web bất kỳ (Chrome, Edge, Firefox,...) và truy cập đường dẫn:
   ```
   http://localhost:3000
   ```

---

## 📂 Danh sách chức năng chính trong ứng dụng

1. **Bảng điều khiển (Dashboard)**: Thống kê doanh thu, số đơn đặt tiệc đang chờ, tổng số dịch vụ và vẽ biểu đồ tăng trưởng doanh thu 6 tháng gần nhất bằng Chart.js, hiển thị danh sách đơn hàng gần đây và món ăn ưa chuộng.
2. **Quản lý Loại (`Loai`)**: Thêm, sửa, xóa các nhóm sản phẩm và dịch vụ (Món khai vị, Món chính, Đồ uống, Dịch vụ,...).
3. **Thực đơn & Dịch vụ (`Menu_Dichvu`)**: Quản lý danh sách món ăn kèm đơn giá, giảm giá, hình ảnh minh họa vector sắc nét (được lưu dưới dạng file `.svg` trong thư mục `public/images/`).
4. **Quản lý Đặt Tiệc (`DatTiec` & `ChiTietDatTiec`)**: Giao diện đặt tiệc cưới thông minh cho phép nhập thông tin khách hàng, ngày tổ chức, cọc tiền và chọn trực tiếp món ăn/dịch vụ với tính toán tiền tự động trực quan.
5. **Thanh toán & Hóa đơn (`ThanhToan` & `ChiTietThanhToan`)**: Thực hiện thanh toán, ghi nhận phụ thu phát sinh hoặc chiết khấu giảm giá của hóa đơn, tạo biên lai và in hóa đơn tiệc cưới chuyên nghiệp trực tiếp qua máy in của trình duyệt (CSS in ấn tự động ẩn đi các phần thừa).

---

## 📂 Cơ cấu tổ chức thư mục

```text
QuanLyNhaHangTiecCuoi/
├── db.json                 # Cơ sở dữ liệu JSON lưu trữ các bảng Loai, Menu_Dichvu, DatTiec, ThanhToan...
├── package.json            # Cấu hình dự án Node.js & các thư viện cần thiết
├── server.js               # Mã nguồn Express Server (Xử lý APIs CRUD, tính toán hóa đơn)
├── generate_assets.js      # Script tạo tài nguyên ảnh vector SVG minh họa (đã chạy thành công)
├── README.md               # File tài liệu hướng dẫn sử dụng này
└── public/                 # Thư mục giao diện của ứng dụng
    ├── index.html          # Trang HTML SPA duy nhất chứa toàn bộ các view và form modal
    ├── app.css             # Phong cách thiết kế Glassmorphism và CSS in ấn hóa đơn
    ├── app.js              # Xử lý điều hướng SPA, gọi APIs và vẽ biểu đồ
    └── images/             # Chứa các file ảnh vector SVG minh họa cho món ăn/dịch vụ
```
