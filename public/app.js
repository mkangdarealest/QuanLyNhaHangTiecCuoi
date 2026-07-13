// ==========================================================================
// ROYAL WEDDING - SPA CLIENT SIDE CONTROLLER
// ==========================================================================

const API_BASE = '/api';

// Application State
let categoriesState = [];
let menuState = [];
let bookingsState = [];
let paymentsState = [];
let currentBookingItems = {}; // Format: { MaMenu_DV: quantity }
let revenueChart = null;

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    initClock();
    loadDashboard();
    
    // Bind search and filter events
    document.getElementById('category-search').addEventListener('input', filterCategories);
    document.getElementById('menu-search').addEventListener('input', filterMenuItems);
    document.getElementById('menu-filter-category').addEventListener('change', filterMenuItems);
    document.getElementById('booking-search').addEventListener('input', filterBookings);
    document.getElementById('payment-search').addEventListener('input', filterPayments);
});

// ==========================================
// SPA ROUTER
// ==========================================
function initRouter() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    function handleRoute() {
        const hash = window.location.hash || '#dashboard';
        const viewId = 'view-' + hash.substring(1);
        
        // Hide all views, deactivate all links
        document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            
            // Highlight link
            const targetLink = document.querySelector(`.sidebar-nav .nav-link[href="${hash}"]`);
            if (targetLink) targetLink.classList.add('active');
            
            // Set Page Title
            updateHeaderTitle(hash.substring(1));
            
            // Fetch view data
            loadViewData(hash.substring(1));
        }
    }
    
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Run once on startup
}

function updateHeaderTitle(view) {
    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    
    switch (view) {
        case 'dashboard':
            titleEl.textContent = 'Bảng Điều Khiển';
            subtitleEl.textContent = 'Chào mừng trở lại! Xem báo cáo hoạt động nhà hàng hôm nay.';
            break;
        case 'categories':
            titleEl.textContent = 'Quản Lý Loại Món & Dịch Vụ';
            subtitleEl.textContent = 'Quản lý danh sách các loại thực đơn và dịch vụ hỗ trợ đám cưới.';
            break;
        case 'menu':
            titleEl.textContent = 'Thực Đơn & Dịch Vụ';
            subtitleEl.textContent = 'Cập nhật món ăn ngon, đồ uống và các dịch vụ trang trí sân khấu, ban nhạc.';
            break;
        case 'bookings':
            titleEl.textContent = 'Quản Lý Đặt Tiệc';
            subtitleEl.textContent = 'Tạo đơn đặt tiệc cưới mới, lên thực đơn, nhận tiền cọc và theo dõi ngày tổ chức.';
            break;
        case 'payments':
            titleEl.textContent = 'Thanh Toán & Hóa Đơn';
            subtitleEl.textContent = 'Xem danh sách hóa đơn thanh toán tiệc cưới, phụ thu phát sinh và in hóa đơn khách hàng.';
            break;
    }
}

function loadViewData(view) {
    switch (view) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'menu':
            loadMenu();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'payments':
            loadPayments();
            break;
    }
}

// Clock Widget
function initClock() {
    const clockEl = document.getElementById('current-time');
    
    function updateClock() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        clockEl.textContent = `${timeStr} - ${dateStr}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ==========================================
// GLOBAL UI UTILS (Toasts & Formats)
// ==========================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderColor = type === 'error' ? 'var(--danger)' : 'var(--primary-color)';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ==========================================
// 1. DASHBOARD LOGIC
// ==========================================
async function loadDashboard() {
    try {
        const res = await fetch(`${API_BASE}/dashboard`);
        const data = await res.json();
        
        // Update Widgets
        document.getElementById('stat-revenue').textContent = formatCurrency(data.totalRevenue);
        document.getElementById('stat-bookings').textContent = data.totalBookings;
        document.getElementById('stat-pending').textContent = data.pendingBookings;
        document.getElementById('stat-services').textContent = data.totalServices;
        
        // Render Recent Bookings
        const recentContainer = document.getElementById('dashboard-recent-bookings');
        recentContainer.innerHTML = '';
        
        if (data.recentBookings.length === 0) {
            recentContainer.innerHTML = '<p class="text-muted text-center py-4">Chưa có tiệc cưới nào được đặt.</p>';
        } else {
            data.recentBookings.forEach(booking => {
                const itemEl = document.createElement('div');
                itemEl.className = 'recent-item';
                
                const badgeClass = booking.TrangThai === 'Đã thanh toán' ? 'badge-paid' : 'badge-booked';
                
                itemEl.innerHTML = `
                    <div class="recent-info">
                        <h4>${booking.TenKhach}</h4>
                        <span>SĐT: ${booking.SDT} | Ngày cưới: ${booking.NgayThucHien}</span>
                    </div>
                    <div class="recent-amount">
                        <span class="recent-price">${formatCurrency(booking.TongTien)}</span>
                        <span class="badge ${badgeClass}">${booking.TrangThai}</span>
                    </div>
                `;
                recentContainer.appendChild(itemEl);
            });
        }

        // Render Popular Items
        const popularContainer = document.getElementById('dashboard-popular-items');
        popularContainer.innerHTML = '';
        
        if (data.popularItems.length === 0) {
            popularContainer.innerHTML = '<p class="text-muted text-center py-4 col-span-full">Chưa có số liệu phổ biến.</p>';
        } else {
            data.popularItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'popular-item-card';
                card.innerHTML = `
                    <i class="ri-heart-3-line"></i>
                    <h4>${item.name}</h4>
                    <span>Đã đặt: ${item.count} lượt</span>
                `;
                popularContainer.appendChild(card);
            });
        }

        // Render Chart
        renderRevenueChart(data.chartData);
        
    } catch (err) {
        console.error(err);
        showToast("Lỗi tải dữ liệu bảng điều khiển", "error");
    }
}

function renderRevenueChart(chartData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Doanh Thu Thực Tế (₫)',
                data: chartData.data,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f8fafc'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value.toLocaleString('vi-VN') + ' ₫';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// ==========================================
// 2. CATEGORIES LOGIC
// ==========================================
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/loai`);
        categoriesState = await res.json();
        renderCategories(categoriesState);
    } catch (err) {
        showToast("Lỗi tải danh mục loại", "error");
    }
}

function renderCategories(list) {
    const tbody = document.getElementById('categories-table-body');
    tbody.innerHTML = '';
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Chưa có loại món ăn/dịch vụ nào.</td></tr>';
        return;
    }
    
    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.MaLoai}</strong></td>
            <td>${item.TenLoai}</td>
            <td>${item.MoTa || '<em class="text-muted">Chưa có mô tả</em>'}</td>
            <td class="actions-cell">
                <button class="btn btn-secondary btn-icon" onclick="openCategoryModal('${item.MaLoai}', '${item.TenLoai}', \`${item.MoTa || ''}\`)" title="Sửa">
                    <i class="ri-edit-line"></i>
                </button>
                <button class="btn btn-danger btn-icon" onclick="deleteCategory('${item.MaLoai}')" title="Xóa">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterCategories() {
    const q = document.getElementById('category-search').value.toLowerCase();
    const filtered = categoriesState.filter(item => 
        item.MaLoai.toLowerCase().includes(q) || 
        item.TenLoai.toLowerCase().includes(q) || 
        (item.MoTa && item.MoTa.toLowerCase().includes(q))
    );
    renderCategories(filtered);
}

function openCategoryModal(id = '', name = '', desc = '') {
    document.getElementById('category-modal-title').textContent = id ? 'Cập Nhật Loại Món/Dịch Vụ' : 'Thêm Loại Mới';
    document.getElementById('category-id').value = id;
    document.getElementById('category-name').value = name;
    document.getElementById('category-desc').value = desc;
    openModal('modal-category');
}

async function saveCategory(e) {
    e.preventDefault();
    const id = document.getElementById('category-id').value;
    const TenLoai = document.getElementById('category-name').value;
    const MoTa = document.getElementById('category-desc').value;
    
    const body = { TenLoai, MoTa };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/loai/${id}` : `${API_BASE}/loai`;
    
    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gặp sự cố khi lưu.");
        }
        
        showToast(id ? "Cập nhật loại thành công!" : "Thêm loại mới thành công!");
        closeModal('modal-category');
        loadCategories();
    } catch (err) {
        showToast(err.message, "error");
    }
}

async function deleteCategory(id) {
    if (!confirm(`Bạn chắc chắn muốn xóa loại ${id}?`)) return;
    
    try {
        const res = await fetch(`${API_BASE}/loai/${id}`, { method: 'DELETE' });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Lỗi xóa loại.");
        }
        
        showToast("Xóa loại thành công!");
        loadCategories();
    } catch (err) {
        showToast(err.message, "error");
    }
}

// ==========================================
// 3. MENU & SERVICES LOGIC
// ==========================================
async function loadMenu() {
    try {
        // Load categories first to populate selector
        const catRes = await fetch(`${API_BASE}/loai`);
        categoriesState = await catRes.json();
        
        // Populate category options in selectors
        const menuFilter = document.getElementById('menu-filter-category');
        const itemFormCategory = document.getElementById('menu-category');
        
        menuFilter.innerHTML = '<option value="">Tất cả phân loại</option>';
        itemFormCategory.innerHTML = '<option value="" disabled selected>Chọn phân loại...</option>';
        
        categoriesState.forEach(cat => {
            menuFilter.innerHTML += `<option value="${cat.MaLoai}">${cat.TenLoai}</option>`;
            itemFormCategory.innerHTML += `<option value="${cat.MaLoai}">${cat.TenLoai}</option>`;
        });

        // Load menu items
        const menuRes = await fetch(`${API_BASE}/menu_dichvu`);
        menuState = await menuRes.json();
        renderMenu(menuState);
    } catch (err) {
        showToast("Lỗi tải dữ liệu thực đơn & dịch vụ", "error");
    }
}

function renderMenu(list) {
    const container = document.getElementById('menu-items-grid');
    container.innerHTML = '';
    
    if (list.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-muted py-8">Chưa có món ăn hay dịch vụ nào được định nghĩa.</div>';
        return;
    }
    
    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        
        const discountedPrice = item.DonGia * (1 - item.GiamGia / 100);
        
        card.innerHTML = `
            <div class="menu-img-wrapper">
                <img src="${item.HinhAnh || 'images/default.jpg'}" alt="${item.TenMenu_DV}">
                <span class="menu-badge">${item.TenLoai}</span>
                ${item.GiamGia > 0 ? `<span class="menu-discount-badge">-${item.GiamGia}%</span>` : ''}
            </div>
            <div class="menu-details">
                <h3>${item.TenMenu_DV}</h3>
                <p class="menu-desc" title="${item.MoTa}">${item.MoTa || 'Chưa có mô tả chi tiết.'}</p>
                <div class="menu-pricing">
                    <div class="price-box">
                        ${item.GiamGia > 0 ? `<span class="original-price">${formatCurrency(item.DonGia)}</span>` : ''}
                        <span class="final-price">${formatCurrency(discountedPrice)}</span>
                    </div>
                    <div class="actions-cell">
                        <button class="btn btn-secondary btn-icon" onclick="openMenuModal('${item.MaMenu_DV}')" title="Sửa">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="btn btn-danger btn-icon" onclick="deleteMenuItem('${item.MaMenu_DV}')" title="Xóa">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterMenuItems() {
    const q = document.getElementById('menu-search').value.toLowerCase();
    const cat = document.getElementById('menu-filter-category').value;
    
    const filtered = menuState.filter(item => {
        const matchQ = item.TenMenu_DV.toLowerCase().includes(q) || 
                       item.MaMenu_DV.toLowerCase().includes(q) || 
                       (item.MoTa && item.MoTa.toLowerCase().includes(q));
        const matchCat = cat === '' || item.Loai === cat;
        return matchQ && matchCat;
    });
    
    renderMenu(filtered);
}

function openMenuModal(id = '') {
    const form = document.getElementById('form-menu');
    form.reset();
    
    if (id) {
        const item = menuState.find(m => m.MaMenu_DV === id);
        if (!item) return;
        
        document.getElementById('menu-modal-title').textContent = 'Cập Nhật Món Ăn/Dịch Vụ';
        document.getElementById('menu-id').value = item.MaMenu_DV;
        document.getElementById('menu-name').value = item.TenMenu_DV;
        document.getElementById('menu-category').value = item.Loai;
        document.getElementById('menu-image').value = item.HinhAnh;
        document.getElementById('menu-price').value = item.DonGia;
        document.getElementById('menu-discount').value = item.GiamGia;
        document.getElementById('menu-desc').value = item.MoTa;
    } else {
        document.getElementById('menu-modal-title').textContent = 'Thêm Món / Dịch Vụ Mới';
        document.getElementById('menu-id').value = '';
    }
    openModal('modal-menu');
}

async function saveMenuItem(e) {
    e.preventDefault();
    const id = document.getElementById('menu-id').value;
    
    const body = {
        TenMenu_DV: document.getElementById('menu-name').value,
        Loai: document.getElementById('menu-category').value,
        HinhAnh: document.getElementById('menu-image').value,
        DonGia: Number(document.getElementById('menu-price').value),
        GiamGia: Number(document.getElementById('menu-discount').value),
        MoTa: document.getElementById('menu-desc').value
    };
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/menu_dichvu/${id}` : `${API_BASE}/menu_dichvu`;
    
    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gặp sự cố khi lưu món ăn.");
        }
        
        showToast(id ? "Cập nhật thực đơn thành công!" : "Thêm mới món/dịch vụ thành công!");
        closeModal('modal-menu');
        loadMenu();
    } catch (err) {
        showToast(err.message, "error");
    }
}

async function deleteMenuItem(id) {
    if (!confirm(`Bạn chắc chắn muốn xóa sản phẩm/dịch vụ ${id}?`)) return;
    
    try {
        const res = await fetch(`${API_BASE}/menu_dichvu/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Lỗi xóa sản phẩm.");
        }
        showToast("Xóa sản phẩm thành công!");
        loadMenu();
    } catch (err) {
        showToast(err.message, "error");
    }
}

// ==========================================
// 4. BOOKINGS LOGIC
// ==========================================
async function loadBookings() {
    try {
        const res = await fetch(`${API_BASE}/dattiec`);
        bookingsState = await res.json();
        renderBookings(bookingsState);
    } catch (err) {
        showToast("Lỗi tải danh sách đặt tiệc", "error");
    }
}

function renderBookings(list) {
    const tbody = document.getElementById('bookings-table-body');
    tbody.innerHTML = '';
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">Chưa có tiệc cưới nào được đặt.</td></tr>';
        return;
    }
    
    list.forEach(booking => {
        const tr = document.createElement('tr');
        const statusBadge = booking.TrangThai === 'Đã thanh toán' 
            ? '<span class="badge badge-paid">Đã thanh toán</span>' 
            : '<span class="badge badge-booked">Đã cọc</span>';
            
        // Show/hide payment or editing buttons depending on payment status
        const isPaid = booking.TrangThai === 'Đã thanh toán';
        
        tr.innerHTML = `
            <td><strong>${booking.IdDatTiec}</strong></td>
            <td>${booking.TenKhach}</td>
            <td>${booking.SDT}</td>
            <td>${booking.NgayThucHien}</td>
            <td>${formatCurrency(booking.TongTien)}</td>
            <td>${formatCurrency(booking.DatCoc)}</td>
            <td class="${booking.ConLai > 0 ? 'text-danger font-semibold' : ''}">${formatCurrency(booking.ConLai)}</td>
            <td>${statusBadge}</td>
            <td class="actions-cell">
                ${!isPaid ? `
                    <button class="btn btn-success btn-icon" onclick="openPaymentModal('${booking.IdDatTiec}')" title="Thanh Toán">
                        <i class="ri-hand-coin-line"></i>
                    </button>
                    <button class="btn btn-secondary btn-icon" onclick="openBookingModal('${booking.IdDatTiec}')" title="Sửa">
                        <i class="ri-edit-line"></i>
                    </button>
                ` : `
                    <button class="btn btn-secondary btn-icon" onclick="viewInvoiceFromBooking('${booking.IdDatTiec}')" title="Xem Hóa Đơn">
                        <i class="ri-file-text-line"></i>
                    </button>
                `}
                <button class="btn btn-danger btn-icon" onclick="deleteBooking('${booking.IdDatTiec}')" title="Xóa" ${isPaid ? 'disabled' : ''}>
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterBookings() {
    const q = document.getElementById('booking-search').value.toLowerCase();
    const filtered = bookingsState.filter(b => 
        b.IdDatTiec.toLowerCase().includes(q) ||
        b.TenKhach.toLowerCase().includes(q) ||
        b.SDT.includes(q) ||
        b.TenNhanVien.toLowerCase().includes(q)
    );
    renderBookings(filtered);
}

// Booking Form & Menu Item Selection wizard
async function openBookingModal(id = '') {
    const form = document.getElementById('form-booking');
    form.reset();
    currentBookingItems = {};
    
    // 1. Fetch categories & items to populate items selector
    try {
        const catRes = await fetch(`${API_BASE}/loai`);
        const cats = await catRes.json();
        
        // Populate selector filter
        const selectorFilter = document.getElementById('booking-item-category-filter');
        selectorFilter.innerHTML = '<option value="">Tất cả loại sản phẩm</option>';
        cats.forEach(cat => {
            selectorFilter.innerHTML += `<option value="${cat.MaLoai}">${cat.TenLoai}</option>`;
        });
        
        const menuRes = await fetch(`${API_BASE}/menu_dichvu`);
        menuState = await menuRes.json();
        
        // Render Selector items list
        renderBookingSelectorItems(menuState, cats);

        if (id) {
            // Edit Booking Flow
            document.getElementById('booking-modal-title').textContent = `Chỉnh Sửa Đơn Đặt Tiệc: ${id}`;
            document.getElementById('booking-id').value = id;
            
            // Load booking data from API (including details)
            const detailRes = await fetch(`${API_BASE}/dattiec/${id}`);
            const data = await detailRes.json();
            
            document.getElementById('booking-cust-name').value = data.TenKhach;
            document.getElementById('booking-phone').value = data.SDT;
            document.getElementById('booking-staff').value = data.TenNhanVien;
            document.getElementById('booking-date-execution').value = data.NgayThucHien;
            document.getElementById('booking-deposit').value = data.DatCoc;
            document.getElementById('booking-notes').value = data.GhiChu;
            
            // Pre-fill quantities
            data.details.forEach(item => {
                currentBookingItems[item.MaMenu_DV] = item.SoLuong;
                
                // Select checkbox and display quantity
                const checkbox = document.getElementById(`chk-${item.MaMenu_DV}`);
                if (checkbox) {
                    checkbox.checked = true;
                    const itemCard = checkbox.closest('.selector-item');
                    itemCard.classList.add('selected');
                    
                    const qtyInput = document.getElementById(`qty-${item.MaMenu_DV}`);
                    if (qtyInput) qtyInput.value = item.SoLuong;
                }
            });
            
        } else {
            // Create New Booking Flow
            document.getElementById('booking-modal-title').textContent = 'Đặt Tiệc Cưới Mới';
            document.getElementById('booking-id').value = '';
            document.getElementById('booking-date-execution').value = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]; // Default 7 days from now
            document.getElementById('booking-deposit').value = 10000000; // Default deposit 10 mil
            document.getElementById('booking-staff').value = 'Lễ Tân';
        }
        
        calculateBookingTotals();
        openModal('modal-booking');
        
    } catch (err) {
        showToast("Lỗi chuẩn bị danh sách món ăn", "error");
        console.error(err);
    }
}

function renderBookingSelectorItems(items, categories) {
    const listContainer = document.getElementById('booking-selector-list');
    listContainer.innerHTML = '';
    
    if (items.length === 0) {
        listContainer.innerHTML = '<p class="text-muted text-center py-4">Chưa có thực đơn/dịch vụ.</p>';
        return;
    }
    
    items.forEach(item => {
        const cat = categories.find(c => c.MaLoai === item.Loai);
        const catName = cat ? cat.TenLoai : 'Chưa phân loại';
        
        const discountedPrice = item.DonGia * (1 - item.GiamGia / 100);
        
        const el = document.createElement('div');
        el.className = 'selector-item';
        el.dataset.category = item.Loai;
        el.id = `selector-card-${item.MaMenu_DV}`;
        
        el.innerHTML = `
            <input type="checkbox" id="chk-${item.MaMenu_DV}" class="item-check-input" onchange="toggleBookingItem('${item.MaMenu_DV}', this.checked)">
            <div class="item-details-brief">
                <span class="item-name-brief">${item.TenMenu_DV} <small class="text-muted">(${catName})</small></span>
                <span class="item-price-brief">${formatCurrency(discountedPrice)} ${item.GiamGia > 0 ? `<small class="text-danger">(-${item.GiamGia}%)</small>` : ''}</span>
            </div>
            <div class="qty-control">
                <button type="button" onclick="adjustBookingItemQty('${item.MaMenu_DV}', -1)">-</button>
                <input type="number" id="qty-${item.MaMenu_DV}" value="1" min="1" onchange="updateBookingItemQty('${item.MaMenu_DV}', this.value)">
                <button type="button" onclick="adjustBookingItemQty('${item.MaMenu_DV}', 1)">+</button>
            </div>
        `;
        listContainer.appendChild(el);
    });
}

function filterBookingSelectorItems() {
    const cat = document.getElementById('booking-item-category-filter').value;
    const cards = document.querySelectorAll('.booking-selector-list .selector-item');
    
    cards.forEach(card => {
        if (cat === '' || card.dataset.category === cat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function toggleBookingItem(code, checked) {
    const card = document.getElementById(`selector-card-${code}`);
    if (checked) {
        card.classList.add('selected');
        const qtyInput = document.getElementById(`qty-${code}`);
        currentBookingItems[code] = parseInt(qtyInput.value) || 1;
    } else {
        card.classList.remove('selected');
        delete currentBookingItems[code];
    }
    calculateBookingTotals();
}

function adjustBookingItemQty(code, delta) {
    const input = document.getElementById(`qty-${code}`);
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
    
    if (currentBookingItems[code]) {
        currentBookingItems[code] = val;
        calculateBookingTotals();
    }
}

function updateBookingItemQty(code, value) {
    let val = parseInt(value) || 1;
    if (val < 1) val = 1;
    document.getElementById(`qty-${code}`).value = val;
    
    if (currentBookingItems[code]) {
        currentBookingItems[code] = val;
        calculateBookingTotals();
    }
}

function calculateBookingTotals() {
    let TongSL = 0;
    let TongTien = 0;
    
    Object.keys(currentBookingItems).forEach(code => {
        const item = menuState.find(m => m.MaMenu_DV === code);
        if (item) {
            const qty = currentBookingItems[code];
            const finalPrice = item.DonGia * (1 - item.GiamGia / 100);
            TongSL += qty;
            TongTien += qty * finalPrice;
        }
    });
    
    const deposit = Number(document.getElementById('booking-deposit').value) || 0;
    const conLai = TongTien - deposit;
    
    // Display
    document.getElementById('billing-qty').textContent = TongSL;
    document.getElementById('billing-subtotal').textContent = formatCurrency(TongTien);
    document.getElementById('billing-deposit-disp').textContent = formatCurrency(deposit);
    document.getElementById('billing-final').textContent = formatCurrency(conLai < 0 ? 0 : conLai);
}

async function saveBooking(e) {
    e.preventDefault();
    
    const id = document.getElementById('booking-id').value;
    
    // Prepare items array
    const items = Object.keys(currentBookingItems).map(code => ({
        MaMenu_DV: code,
        SoLuong: currentBookingItems[code]
    }));
    
    if (items.length === 0) {
        showToast("Bạn phải chọn ít nhất 1 món ăn hoặc dịch vụ cho tiệc cưới!", "error");
        return;
    }
    
    const body = {
        TenKhach: document.getElementById('booking-cust-name').value,
        SDT: document.getElementById('booking-phone').value,
        TenNhanVien: document.getElementById('booking-staff').value,
        NgayThucHien: document.getElementById('booking-date-execution').value,
        DatCoc: Number(document.getElementById('booking-deposit').value),
        GhiChu: document.getElementById('booking-notes').value,
        items
    };
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/dattiec/${id}` : `${API_BASE}/dattiec`;
    
    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gặp lỗi khi lưu đơn đặt tiệc.");
        }
        
        showToast(id ? "Cập nhật đặt tiệc thành công!" : "Tạo đặt tiệc cưới mới thành công!");
        closeModal('modal-booking');
        loadBookings();
    } catch (err) {
        showToast(err.message, "error");
    }
}

async function deleteBooking(id) {
    if (!confirm(`Bạn chắc chắn muốn HỦY và XÓA đơn đặt tiệc ${id}?`)) return;
    
    try {
        const res = await fetch(`${API_BASE}/dattiec/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gặp lỗi khi xóa đơn.");
        }
        showToast("Đã hủy đơn đặt tiệc cưới thành công!");
        loadBookings();
    } catch (err) {
        showToast(err.message, "error");
    }
}

// ==========================================
// 5. PAYMENTS & INVOICES LOGIC
// ==========================================
async function loadPayments() {
    try {
        const res = await fetch(`${API_BASE}/thanhtoan`);
        paymentsState = await res.json();
        renderPayments(paymentsState);
    } catch (err) {
        showToast("Lỗi tải danh sách hóa đơn", "error");
    }
}

function renderPayments(list) {
    const tbody = document.getElementById('payments-table-body');
    tbody.innerHTML = '';
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">Chưa có hóa đơn thanh toán nào được thực hiện.</td></tr>';
        return;
    }
    
    list.forEach(inv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${inv.IdThanhtoan}</strong></td>
            <td>${inv.IdDatTiec}</td>
            <td>${inv.TenKhach}</td>
            <td>${inv.Ngaytt}</td>
            <td>${formatCurrency(inv.TongTien)}</td>
            <td>${formatCurrency(inv.DaDatCoc)}</td>
            <td class="text-danger">+${formatCurrency(inv.TienPhaiNopThem)}</td>
            <td class="text-success">-${formatCurrency(inv.TienGiamGia)}</td>
            <td><strong>${formatCurrency(inv.TongTienKhachTra)}</strong></td>
            <td class="actions-cell">
                <button class="btn btn-primary btn-icon" onclick="viewInvoiceDetail('${inv.IdThanhtoan}')" title="Xem & In Hóa Đơn">
                    <i class="ri-printer-line"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterPayments() {
    const q = document.getElementById('payment-search').value.toLowerCase();
    const filtered = paymentsState.filter(p => 
        p.IdThanhtoan.toLowerCase().includes(q) ||
        p.IdDatTiec.toLowerCase().includes(q) ||
        p.TenKhach.toLowerCase().includes(q) ||
        p.SD.includes(q)
    );
    renderPayments(filtered);
}

// Checkout Form Logic
let paymentBookingDetails = null;

async function openPaymentModal(bookingId) {
    try {
        const res = await fetch(`${API_BASE}/dattiec/${bookingId}`);
        paymentBookingDetails = await res.json();
        
        document.getElementById('payment-booking-id').value = bookingId;
        document.getElementById('pay-cust-name').textContent = paymentBookingDetails.TenKhach;
        document.getElementById('pay-cust-phone').textContent = paymentBookingDetails.SDT;
        document.getElementById('pay-date-exec').textContent = paymentBookingDetails.NgayThucHien;
        document.getElementById('pay-total-party').textContent = formatCurrency(paymentBookingDetails.TongTien);
        document.getElementById('pay-total-deposit').textContent = formatCurrency(paymentBookingDetails.DatCoc);
        
        const conLai = paymentBookingDetails.TongTien - paymentBookingDetails.DatCoc;
        document.getElementById('pay-balance').textContent = formatCurrency(conLai < 0 ? 0 : conLai);
        
        document.getElementById('pay-extra-cost').value = 0;
        document.getElementById('pay-discount').value = 0;
        document.getElementById('pay-notes').value = '';
        
        calculatePaymentFinal();
        openModal('modal-payment');
    } catch (err) {
        showToast("Lỗi tải chi tiết đơn để thanh toán", "error");
    }
}

function calculatePaymentFinal() {
    if (!paymentBookingDetails) return;
    
    const conLai = paymentBookingDetails.TongTien - paymentBookingDetails.DatCoc;
    const extra = Number(document.getElementById('pay-extra-cost').value) || 0;
    const discount = Number(document.getElementById('pay-discount').value) || 0;
    
    const finalCharge = conLai + extra - discount;
    document.getElementById('pay-final-charge').textContent = formatCurrency(finalCharge < 0 ? 0 : finalCharge);
}

async function processPayment(e) {
    e.preventDefault();
    
    const IdDatTiec = document.getElementById('payment-booking-id').value;
    const TienPhaiNopThem = Number(document.getElementById('pay-extra-cost').value) || 0;
    const TienGiamGia = Number(document.getElementById('pay-discount').value) || 0;
    const GhiChu = document.getElementById('pay-notes').value;
    
    const body = {
        IdDatTiec,
        TienPhaiNopThem,
        TienGiamGia,
        GhiChu,
        Ngaytt: new Date().toISOString().split('T')[0]
    };
    
    try {
        const res = await fetch(`${API_BASE}/thanhtoan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gặp lỗi khi tạo hóa đơn.");
        }
        
        const invoice = await res.json();
        showToast("Thanh toán tiệc cưới thành công!");
        closeModal('modal-payment');
        
        // Auto-open print view for generated invoice
        viewInvoiceDetail(invoice.IdThanhtoan);
        
        // Refresh bookings and dashboard
        loadBookings();
    } catch (err) {
        showToast(err.message, "error");
    }
}

// Render Printable Invoice Template
async function viewInvoiceDetail(invoiceId) {
    try {
        const res = await fetch(`${API_BASE}/thanhtoan/${invoiceId}`);
        const data = await res.json();
        
        renderPrintableInvoice(data);
        openModal('modal-invoice-detail');
    } catch (err) {
        showToast("Không thể tải chi tiết hóa đơn", "error");
    }
}

async function viewInvoiceFromBooking(bookingId) {
    // Find payment invoice corresponding to booking
    try {
        const res = await fetch(`${API_BASE}/thanhtoan`);
        const payments = await res.json();
        const found = payments.find(p => p.IdDatTiec === bookingId);
        
        if (found) {
            viewInvoiceDetail(found.IdThanhtoan);
        } else {
            showToast("Không tìm thấy hóa đơn thanh toán cho đơn đặt tiệc này.", "error");
        }
    } catch (err) {
        showToast("Lỗi truy vấn hóa đơn", "error");
    }
}

function renderPrintableInvoice(inv) {
    const area = document.getElementById('invoice-print-area');
    
    let itemsHTML = '';
    inv.details.forEach((item, index) => {
        const finalPrice = item.DonGia * (1 - item.GiamGia / 100);
        itemsHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${item.MaMenu_DV}</strong> - ${item.TenMenu_DV}</td>
                <td class="text-right">${item.SoLuong}</td>
                <td class="text-right">${formatCurrency(item.DonGia)}</td>
                <td class="text-right">${item.GiamGia}%</td>
                <td class="text-right"><strong>${formatCurrency(item.SoLuong * finalPrice)}</strong></td>
            </tr>
        `;
    });
    
    area.innerHTML = `
        <div class="invoice-header">
            <div class="inv-logo">
                <h2>NHÀ HÀNG TIỆC CƯỚI ROYAL WEDDING</h2>
                <p>Địa chỉ: 123 Đường Song Hành, Quận 1, TP. Hồ Chí Minh</p>
                <p>Điện thoại: 1900 8888 | Email: contact@royalwedding.com</p>
            </div>
            <div class="inv-meta">
                <h3>HÓA ĐƠN THANH TOÁN</h3>
                <p>Số hóa đơn: <strong>${inv.IdThanhtoan}</strong></p>
                <p>Ngày thanh toán: ${inv.Ngaytt}</p>
                <p>Mã tiệc cưới: ${inv.IdDatTiec}</p>
            </div>
        </div>
        
        <div class="inv-info-grid">
            <div class="inv-card">
                <h4>Thông Tin Khách Hàng</h4>
                <p><strong>Đại diện:</strong> ${inv.TenKhach}</p>
                <p><strong>Điện thoại:</strong> ${inv.SD}</p>
                <p><strong>Ngày tổ chức:</strong> ${inv.Ngaythuchien}</p>
            </div>
            <div class="inv-card">
                <h4>Thông Tin Thu Ngân</h4>
                <p><strong>Thu ngân thực hiện:</strong> ${inv.TenNhanVien}</p>
                <p><strong>Trạng thái:</strong> <span class="text-success" style="font-weight: 700;">Đã Thanh Toán Toàn Bộ</span></p>
                <p><strong>Ghi chú đơn:</strong> ${inv.GhiChu || 'Không có ghi chú.'}</p>
            </div>
        </div>
        
        <table class="inv-table">
            <thead>
                <tr>
                    <th style="width: 50px;">STT</th>
                    <th>Tên Món Ăn / Dịch Vụ Cưới</th>
                    <th class="text-right" style="width: 80px;">SL</th>
                    <th class="text-right" style="width: 140px;">Đơn Giá</th>
                    <th class="text-right" style="width: 100px;">Chiết Khấu</th>
                    <th class="text-right" style="width: 160px;">Thành Tiền</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <div class="inv-summary-box">
            <div class="inv-sum-row">
                <span>Tổng chi phí thực đơn & DV:</span>
                <span>${formatCurrency(inv.TongTien)}</span>
            </div>
            <div class="inv-sum-row">
                <span>Số tiền đã đặt cọc trước:</span>
                <span class="text-success">-${formatCurrency(inv.DaDatCoc)}</span>
            </div>
            <div class="inv-sum-row">
                <span>Phụ thu phát sinh:</span>
                <span class="text-danger">+${formatCurrency(inv.TienPhaiNopThem)}</span>
            </div>
            <div class="inv-sum-row">
                <span>Chiết khấu giảm giá hóa đơn:</span>
                <span class="text-success">-${formatCurrency(inv.TienGiamGia)}</span>
            </div>
            <div class="inv-sum-row total">
                <span>TỔNG TIỀN KHÁCH TRẢ:</span>
                <span>${formatCurrency(inv.TongTienKhachTra)}</span>
            </div>
        </div>
        
        <div class="inv-signatures">
            <div class="sig-block">
                <span>Khách Hàng Ký Tên</span>
                <em>(Ký, ghi rõ họ tên)</em>
            </div>
            <div class="sig-block">
                <span>Đại Diện Nhà Hàng</span>
                <em>(Ký, đóng dấu thu ngân)</em>
            </div>
        </div>
    `;
}

function printInvoice() {
    window.print();
}
