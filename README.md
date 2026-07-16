# Hệ Thống Quản Lý Đặt Tiệc Cưới Nhà Hàng - Royal Wedding (Mô hình MVC)

Dự án này là hệ thống quản lý đặt tiệc cưới và thanh toán hóa đơn của nhà hàng được tái cấu trúc hoàn chỉnh theo **mô hình kiến trúc MVC (Model-View-Controller)** chuẩn.

Toàn bộ cấu trúc các bảng và trường dữ liệu gốc trong CSDL `db.json` được **giữ nguyên 100%**, đảm bảo tính tương thích và bảo toàn dữ liệu gốc từ tệp Word `DB_Quanlytieccuoi.docx`.

---

## 📂 Cơ cấu tổ chức thư mục theo mô hình MVC

```text
QuanLyNhaHangTiecCuoi/
├── db.json                 # Cơ sở dữ liệu JSON (không đổi cấu trúc các trường)
├── package.json            # Cấu hình dự án & thư viện phụ thuộc
├── server.js               # Điểm khởi chạy (chỉ khởi tạo Express và gắn kết các Route)
├── generate_assets.js      # Script sinh tài nguyên ảnh vector SVG mẫu
├── README.md               # File hướng dẫn này
│
├── models/                 # LỚP MODEL (Xử lý trực tiếp dữ liệu)
│   ├── db.js               # Đọc/ghi tệp db.json chung
│   ├── loaiModel.js        # Logic dữ liệu bảng Loại (Phân loại)
│   ├── menuModel.js        # Logic dữ liệu bảng Thực đơn & Dịch vụ
│   ├── bookingModel.js     # Logic dữ liệu Đặt tiệc & Chi tiết đặt tiệc
│   └── paymentModel.js     # Logic dữ liệu Hóa đơn thanh toán & Chi tiết thanh toán
│
├── controllers/            # LỚP CONTROLLER (Điều hướng nghiệp vụ)
│   ├── loaiController.js   # Điều phối các API phân loại món ăn
│   ├── menuController.js   # Điều phối các API món ăn & dịch vụ tiệc cưới
│   ├── bookingController.js# Điều phối các API tạo lịch tiệc, cập nhật cọc
│   ├── paymentController.js# Điều phối các API thanh toán và tạo hóa đơn
│   └── dashboardController.js # Tính toán số liệu doanh thu & thống kê biểu đồ
│
├── routes/                 # LỚP ROUTER (Phân luồng đường dẫn API)
│   ├── loaiRoutes.js       # Định tuyến cho các URL dạng /api/loai
│   ├── menuRoutes.js       # Định tuyến cho các URL dạng /api/menu_dichvu
│   ├── bookingRoutes.js    # Định tuyến cho các URL dạng /api/dattiec
│   ├── paymentRoutes.js    # Định tuyến cho các URL dạng /api/thanhtoan
│   └── dashboardRoutes.js  # Định tuyến cho các URL dạng /api/dashboard
│
└── public/                 # LỚP VIEW (Giao diện hiển thị người dùng)
    ├── index.html          # File giao diện SPA duy nhất
    ├── app.css             # Thiết kế Glassmorphism tối & định dạng in ấn hóa đơn
    ├── app.js              # Gọi APIs đến Backend, vẽ biểu đồ Chart.js
    └── images/             # Chứa các file ảnh món ăn và dịch vụ cưới (.webp, .jpg, .svg)
```

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy nhanh trong VS Code

1.  **Mở thư mục trong VS Code**: Mở Visual Studio Code, chọn `File` -> `Open Folder...` và chọn thư mục `QuanLyNhaHangTiecCuoi`.
2.  **Mở cửa sổ Terminal**: Nhấn tổ hợp phím `Ctrl + \`` (hoặc vào menu `Terminal` -> `New Terminal`).
3.  **Cài đặt các thư viện**:
    ```bash
    npm install
    ```
4.  **Khởi chạy server**:
    ```bash
    npm start
    ```
5.  **Truy cập ứng dụng**: Mở trình duyệt web và truy cập đường dẫn:
    ```
    http://localhost:3000
    ```

---

## 🔄 Luồng hoạt động của mô hình MVC trong ứng dụng

1.  Khi người dùng thao tác trên giao diện trình duyệt (**View - `public/`**), một yêu cầu HTTP được gửi đi (ví dụ: `GET /api/dattiec`).
2.  Yêu cầu này được nhận diện bởi tệp **`server.js`** và chuyển tiếp vào lớp định tuyến tương ứng (**Router - `routes/bookingRoutes.js`**).
3.  Router sẽ gọi hàm xử lý phù hợp của lớp điều khiển (**Controller - `controllers/bookingController.js`**).
4.  Controller tiếp nhận và gọi hàm truy xuất dữ liệu từ lớp mô hình (**Model - `models/bookingModel.js`**).
5.  Model thực hiện đọc tệp cơ sở dữ liệu **`db.json`** thông qua utility **`models/db.js`**, thực hiện các phép tính toán, sắp xếp hoặc kiểm tra logic ràng buộc, sau đó trả dữ liệu về Controller.
6.  Controller nhận kết quả và gửi phản hồi dạng JSON về lại cho **View** trình duyệt hiển thị động lên màn hình.
