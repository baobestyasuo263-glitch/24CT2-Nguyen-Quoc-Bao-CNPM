import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Statistics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error(`Không thể lấy dữ liệu đơn hàng (${response.status})`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
      setError(err.message || "Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const completedOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = String(order.status || "").trim().toLowerCase();
      return status === "hoàn thành" || status === "đã giao";
    });
  }, [orders]);

  const cancelledOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = String(order.status || "").trim().toLowerCase();
      return status === "đã hủy" || status === "đã huỷ";
    });
  }, [orders]);

  const revenue = useMemo(() => {
    return completedOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );
  }, [completedOrders]);

  const revenueByDay = useMemo(() => {
    const grouped = {};

    completedOrders.forEach((order) => {
      if (!order.orderDate) return;

      const date = new Date(order.orderDate);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toLocaleDateString("vi-VN");

      if (!grouped[key]) {
        grouped[key] = { date, count: 0, revenue: 0 };
      }

      grouped[key].count += 1;
      grouped[key].revenue += Number(order.total || 0);
    });

    return Object.values(grouped).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }, [completedOrders]);

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + "đ";

  return (
    <div className="employee-layout">
      <aside className="employee-sidebar">
        <div className="employee-logo">
          🛒 SHOPWEB
          <span>NHÂN VIÊN</span>
        </div>

        <nav>
          <Link to="/employee">📊 Tổng quan</Link>
          <Link to="/employee/products">📦 Sản phẩm</Link>
          <Link to="/employee/inventory">🏪 Kho hàng</Link>
          <Link to="/employee/orders">🧾 Đơn hàng</Link>
          <Link to="/employee/customers">👥 Khách hàng</Link>
          <Link to="/employee/support">💬 Hỗ trợ</Link>
          <Link to="/employee/statistics">📈 Thống kê</Link>
        </nav>
      </aside>

      <main className="employee-main">
        <header className="employee-header">
          <div>
            <h2>Thống kê</h2>
            <p>Thống kê đơn hàng và doanh thu thực tế</p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="admin-refresh-btn"
            disabled={loading}
          >
            🔄 {loading ? "Đang tải..." : "Làm mới"}
          </button>
        </header>

        <section className="employee-content">
          {error && (
            <div
              style={{
                background: "#fff1f0",
                color: "#cf1322",
                border: "1px solid #ffa39e",
                padding: "14px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ❌ {error}
            </div>
          )}

          <div className="employee-stat-grid">
            <div className="employee-stat-card">
              <div className="stat-icon">🧾</div>
              <div>
                <p>Đơn hàng</p>
                <h2>{loading ? "..." : orders.length}</h2>
              </div>
            </div>

            <div className="employee-stat-card">
              <div className="stat-icon">✅</div>
              <div>
                <p>Hoàn thành</p>
                <h2>{loading ? "..." : completedOrders.length}</h2>
              </div>
            </div>

            <div className="employee-stat-card">
              <div className="stat-icon">❌</div>
              <div>
                <p>Đơn đã hủy</p>
                <h2>{loading ? "..." : cancelledOrders.length}</h2>
              </div>
            </div>

            <div className="employee-stat-card">
              <div className="stat-icon">💰</div>
              <div>
                <p>Doanh thu</p>
                <h2>
                  {loading
                    ? "..."
                    : Number(revenue).toLocaleString("vi-VN") + "đ"}
                </h2>
              </div>
            </div>
          </div>

          <div className="employee-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2>📈 Doanh thu theo ngày</h2>
              <span style={{ color: "#777", fontSize: "14px" }}>
                Chỉ tính đơn đã giao/hoàn thành
              </span>
            </div>

            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : revenueByDay.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#777" }}>
                Chưa có đơn hàng hoàn thành để thống kê doanh thu.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Số đơn</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>

                <tbody>
                  {revenueByDay.map((item) => (
                    <tr key={item.date.toISOString().slice(0, 10)}>
                      <td>{item.date.toLocaleDateString("vi-VN")}</td>
                      <td>{item.count}</td>
                      <td>{formatMoney(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Statistics;
