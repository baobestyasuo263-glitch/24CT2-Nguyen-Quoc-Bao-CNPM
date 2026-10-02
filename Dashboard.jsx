import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // ĐĂNG XUẤT
    // =========================
    const logout = () => {
        localStorage.removeItem("employeeLogin");
        localStorage.removeItem("employeeUser");
        navigate("/employee/login");
    };

    // =========================
    // LẤY DỮ LIỆU DASHBOARD
    // =========================
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [ordersResponse, productsResponse] =
                await Promise.all([
                    fetch("/api/orders"),
                    fetch("/api/products")
                ]);

            if (!ordersResponse.ok) {
                throw new Error("Không thể lấy dữ liệu đơn hàng");
            }

            if (!productsResponse.ok) {
                throw new Error("Không thể lấy dữ liệu sản phẩm");
            }

            const ordersData = await ordersResponse.json();
            const productsData = await productsResponse.json();

            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : []
            );

        } catch (error) {
            console.error("Lỗi Dashboard:", error);

            setError(
                "Không thể kết nối dữ liệu từ hệ thống."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CHẠY KHI MỞ DASHBOARD
    // =========================
    useEffect(() => {
        loadDashboardData();

        // Tự động cập nhật mỗi 30 giây
        const interval = setInterval(() => {
            loadDashboardData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // =========================
    // THỐNG KÊ
    // =========================

    // Tổng đơn hàng
    const totalOrders = orders.length;

    // Các trạng thái còn đang xử lý
    const pendingStatuses = [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Đang chuẩn bị",
        "Đang giao"
    ];

    const pendingOrders = orders.filter(
        (order) =>
            pendingStatuses.includes(order.status)
    ).length;

    // Tổng sản phẩm
    const totalProducts = products.length;

    // =========================
    // DOANH THU HÔM NAY
    // Chỉ tính đơn đã hoàn thành
    // =========================

    const isToday = (dateValue) => {
        if (!dateValue) return false;

        const date = new Date(dateValue);
        const today = new Date();

        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const todayOrders = orders.filter(
        (order) =>
            isToday(order.orderDate) &&
            order.status === "Hoàn thành"
    );

    const todayRevenue = todayOrders.reduce(
        (total, order) =>
            total + Number(order.total || 0),
        0
    );

    // =========================
    // FORMAT TIỀN
    // =========================
    const formatMoney = (value) => {
        return (
            Number(value || 0).toLocaleString("vi-VN") +
            "đ"
        );
    };

    // =========================
    // HOẠT ĐỘNG GẦN ĐÂY
    // Dùng đơn hàng thực tế
    // =========================

    const recentOrders = [...orders]
        .sort((a, b) => {
            return (
                new Date(b.orderDate || 0) -
                new Date(a.orderDate || 0)
            );
        })
        .slice(0, 5);

    // =========================
    // MÀU TRẠNG THÁI
    // =========================

    const getStatusClass = (status) => {
        switch (status) {
            case "Chờ xác nhận":
                return "pending";

            case "Đã xác nhận":
                return "confirmed";

            case "Đang chuẩn bị":
                return "preparing";

            case "Đang giao":
                return "shipping";

            case "Hoàn thành":
                return "completed";

            case "Đã hủy":
                return "cancelled";

            default:
                return "";
        }
    };

    // =========================
    // SIDEBAR
    // =========================

    return (
        <div className="employee-layout">

            {/* ================= SIDEBAR ================= */}
            <aside className="employee-sidebar">

                <div className="employee-logo">
                    <div className="employee-logo-main">
                        🛒 SHOPWEB
                    </div>

                    <span>
                        TRANG QUẢN LÝ NHÂN VIÊN
                    </span>
                </div>

                <div className="employee-menu-title">
                    MENU QUẢN LÝ
                </div>

                <nav>

                    <Link
                        to="/employee"
                        className="employee-nav-link active"
                    >
                        <span>🏠</span>
                        <span>Tổng quan</span>
                    </Link>

                    <Link
                        to="/employee/products"
                        className="employee-nav-link"
                    >
                        <span>📦</span>
                        <span>Sản phẩm</span>
                    </Link>

                    <Link
                        to="/employee/inventory"
                        className="employee-nav-link"
                    >
                        <span>🏪</span>
                        <span>Kho hàng</span>
                    </Link>

                    <Link
                        to="/employee/orders"
                        className="employee-nav-link"
                    >
                        <span>🧾</span>
                        <span>Đơn hàng</span>
                    </Link>

                    <Link
                        to="/employee/customers"
                        className="employee-nav-link"
                    >
                        <span>👥</span>
                        <span>Khách hàng</span>
                    </Link>

                    <Link
                        to="/employee/support"
                        className="employee-nav-link"
                    >
                        <span>💬</span>
                        <span>Hỗ trợ khách hàng</span>
                    </Link>

                    <Link
                        to="/employee/statistics"
                        className="employee-nav-link"
                    >
                        <span>📊</span>
                        <span>Thống kê</span>
                    </Link>

                </nav>

                <button
                    className="employee-logout"
                    onClick={logout}
                >
                    <span>🚪</span>
                    <span>Đăng xuất</span>
                </button>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="employee-main">

                {/* HEADER */}
                <header className="employee-header">

                    <div>

                        <div className="employee-breadcrumb">
                            SHOPWEB / NHÂN VIÊN
                        </div>

                        <h2>
                            Tổng quan
                        </h2>

                        <p>
                            Quản lý và theo dõi hoạt động bán hàng
                        </p>

                    </div>

                    <Link
  to="/employee/profile"
  className="employee-user-box"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <div className="employee-avatar">
    👨‍💼
  </div>

  <div>
    <strong>
      {localStorage.getItem("employeeFullName") ||
        localStorage.getItem("employeeUsername") ||
        "Nhân viên"}
    </strong>

    <small>
      👤 Xem thông tin
    </small>
  </div>
</Link>

                </header>


                {/* CONTENT */}
                <section className="employee-content">

                    {/* TIÊU ĐỀ */}
                    <div className="employee-page-title">

                        <h1>
                            Xin chào, Nhân viên 👋
                        </h1>

                        <p>
                            Chào mừng bạn đến với hệ thống quản lý nhân viên SHOPWEB.
                        </p>

                    </div>


                    {/* ================= THÔNG BÁO LỖI ================= */}

                    {error && (
                        <div
                            style={{
                                background: "#fff3cd",
                                color: "#856404",
                                padding: "15px 20px",
                                borderRadius: "10px",
                                marginBottom: "20px",
                                border: "1px solid #ffeeba"
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}


                    {/* ================= THỐNG KÊ ================= */}

                    <div className="employee-stat-grid">

                        {/* TỔNG ĐƠN */}
                        <div className="employee-stat-card">

                            <div className="employee-stat-icon orange">
                                🧾
                            </div>

                            <div>
                                <span>
                                    Tổng đơn hàng
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalOrders}
                                </strong>

                                <small>
                                    {loading
                                        ? "Đang tải..."
                                        : "Đơn hàng trong hệ thống"}
                                </small>
                            </div>

                        </div>


                        {/* ĐƠN CHỜ XỬ LÝ */}
                        <div className="employee-stat-card">

                            <div className="employee-stat-icon yellow">
                                ⏳
                            </div>

                            <div>
                                <span>
                                    Đơn chờ xử lý
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : pendingOrders}
                                </strong>

                                <small>
                                    {loading
                                        ? "Đang tải..."
                                        : "Đơn cần nhân viên xử lý"}
                                </small>
                            </div>

                        </div>


                        {/* SẢN PHẨM */}
                        <div className="employee-stat-card">

                            <div className="employee-stat-icon blue">
                                📦
                            </div>

                            <div>
                                <span>
                                    Sản phẩm
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalProducts}
                                </strong>

                                <small>
                                    {loading
                                        ? "Đang tải..."
                                        : "Sản phẩm đang quản lý"}
                                </small>
                            </div>

                        </div>


                        {/* DOANH THU */}
                        <div className="employee-stat-card">

                            <div className="employee-stat-icon green">
                                💰
                            </div>

                            <div>
                                <span>
                                    Doanh thu hôm nay
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : formatMoney(todayRevenue)}
                                </strong>

                                <small>
                                    {loading
                                        ? "Đang tải..."
                                        : `${todayOrders.length} đơn hoàn thành hôm nay`}
                                </small>
                            </div>

                        </div>

                    </div>


                    {/* ================= CHỨC NĂNG ================= */}

                    <div className="employee-panel">

                        <div className="employee-panel-header">

                            <div>

                                <h2>
                                    ⚡ Chức năng quản lý
                                </h2>

                                <p>
                                    Các chức năng được cấp cho nhân viên
                                </p>

                            </div>

                        </div>


                        <div className="employee-quick-grid">

                            <Link
                                to="/employee/products"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon">
                                    📦
                                </div>

                                <div>
                                    <h3>
                                        Quản lý sản phẩm
                                    </h3>

                                    <p>
                                        Xem danh sách và thông tin sản phẩm
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>


                            <Link
                                to="/employee/inventory"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon">
                                    🏪
                                </div>

                                <div>
                                    <h3>
                                        Quản lý kho hàng
                                    </h3>

                                    <p>
                                        Kiểm tra và cập nhật số lượng tồn kho
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>


                            <Link
                                to="/employee/orders"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon">
                                    🧾
                                </div>

                                <div>
                                    <h3>
                                        Quản lý đơn hàng
                                    </h3>

                                    <p>
                                        Tiếp nhận và cập nhật trạng thái đơn
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>


                            <Link
                                to="/employee/orders"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon warning-icon">
                                    ⚠️
                                </div>

                                <div>
                                    <h3>
                                        Đơn hàng có vấn đề
                                    </h3>

                                    <p>
                                        Xử lý đơn bị hủy hoặc gặp vấn đề
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>


                            <Link
                                to="/employee/customers"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon">
                                    👥
                                </div>

                                <div>
                                    <h3>
                                        Khách hàng
                                    </h3>

                                    <p>
                                        Xem thông tin khách hàng và đơn hàng
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>


                            <Link
                                to="/employee/support"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon">
                                    💬
                                </div>

                                <div>
                                    <h3>
                                        Hỗ trợ khách hàng
                                    </h3>

                                    <p>
                                        Tiếp nhận và giải đáp yêu cầu
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>


                            <Link
                                to="/employee/statistics"
                                className="employee-quick-card"
                            >
                                <div className="quick-icon">
                                    📊
                                </div>

                                <div>
                                    <h3>
                                        Thống kê
                                    </h3>

                                    <p>
                                        Xem thống kê đơn hàng và doanh thu
                                    </p>
                                </div>

                                <span>→</span>
                            </Link>

                        </div>

                    </div>


                    {/* ================= HOẠT ĐỘNG GẦN ĐÂY ================= */}

                    <div className="employee-panel">

                        <div className="employee-panel-header">

                            <div>

                                <h2>
                                    📋 Hoạt động gần đây
                                </h2>

                                <p>
                                    Các đơn hàng mới và hoạt động bán hàng gần đây
                                </p>

                            </div>

                            <Link to="/employee/orders">
                                Xem tất cả →
                            </Link>

                        </div>


                        {loading ? (

                            <div className="employee-empty-state">
                                <div>⏳</div>

                                <h3>
                                    Đang tải dữ liệu...
                                </h3>

                                <p>
                                    Đang lấy dữ liệu từ hệ thống.
                                </p>
                            </div>

                        ) : recentOrders.length === 0 ? (

                            <div className="employee-empty-state">

                                <div>
                                    📭
                                </div>

                                <h3>
                                    Chưa có đơn hàng
                                </h3>

                                <p>
                                    Khi khách hàng đặt hàng,
                                    hoạt động sẽ xuất hiện tại đây.
                                </p>

                            </div>

                        ) : (

                            <div className="employee-activity-list">

                                {recentOrders.map((order) => (

                                    <div
                                        className="employee-activity-item"
                                        key={order.id}
                                    >

                                        <div className="activity-icon">
                                            🧾
                                        </div>

                                        <div className="activity-info">

                                            <strong>
                                                Đơn hàng #{order.id}
                                            </strong>

                                            <span>
                                                Khách hàng ID: {order.customerId}
                                            </span>

                                            <small>
                                                {order.orderDate
                                                    ? new Date(
                                                        order.orderDate
                                                    ).toLocaleString(
                                                        "vi-VN"
                                                    )
                                                    : "Không có thời gian"}
                                            </small>

                                        </div>


                                        <div className="activity-right">

                                            <span
                                                className={`activity-status ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>

                                            <strong>
                                                {formatMoney(order.total)}
                                            </strong>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* ================= LÀM MỚI ================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px"
                        }}
                    >

                        <button
                            onClick={loadDashboardData}
                            disabled={loading}
                            style={{
                                padding: "11px 20px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#ee4d2d",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            🔄 Làm mới dữ liệu
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;