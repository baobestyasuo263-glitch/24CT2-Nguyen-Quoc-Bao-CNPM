import { useEffect, useState } from "react";

function Payment() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await fetch(
        "/api/orders/details"
      );

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu đơn hàng");
      }

      const data = await response.json();

      console.log("PAYMENT DATA:", data);

      setOrders(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (money) => {
    return Number(money || 0).toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("vi-VN");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Hoàn thành":
      case "Đã giao":
        return "payment-status success";

      case "Đã hủy":
        return "payment-status cancelled";

      case "Chờ xác nhận":
        return "payment-status pending";

      default:
        return "payment-status";
    }
  };

  const getPaymentClass = (method) => {
    if (method === "BANK") {
      return "payment-method bank";
    }

    return "payment-method cod";
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          ⏳ Đang tải dữ liệu thanh toán...
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">

      {/* HEADER */}
      <div className="payment-page-header">
  <div>
    <div className="payment-breadcrumb">
      SHOPWEB / THANH TOÁN
    </div>

    <h1>💳 Thanh toán</h1>

    <p>
      Quản lý thanh toán và thông tin đơn hàng
    </p>
  </div>

  <div className="payment-header-actions">

    <button
      className="payment-home-btn"
      onClick={() => {
        window.location.href = "/admin";
      }}
    >
      ← Về trang chủ
    </button>

    <button
      className="payment-refresh"
      onClick={loadPayments}
    >
      🔄 Làm mới
    </button>

  </div>
</div>


      {/* THỐNG KÊ */}
      <div className="payment-summary">

        <div className="payment-summary-card">
          <div className="summary-icon blue">
            🧾
          </div>

          <div>
            <span>Tổng đơn hàng</span>
            <strong>{orders.length}</strong>
          </div>
        </div>


        <div className="payment-summary-card">
          <div className="summary-icon green">
            💰
          </div>

          <div>
            <span>Tổng giá trị</span>

            <strong>
              {formatMoney(
                orders.reduce(
                  (sum, order) =>
                    sum + Number(order.total || 0),
                  0
                )
              )}
            </strong>
          </div>
        </div>


        <div className="payment-summary-card">
          <div className="summary-icon orange">
            💵
          </div>

          <div>
            <span>COD</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.paymentMethod === "COD"
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="payment-summary-card">
          <div className="summary-icon purple">
            🏦
          </div>

          <div>
            <span>Chuyển khoản</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.paymentMethod === "BANK"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* DANH SÁCH */}
      <div className="payment-card">

        <div className="payment-card-header">

          <div>
            <h2>📋 Danh sách thanh toán</h2>

            <p>
              Dữ liệu được lấy trực tiếp từ hệ thống đơn hàng
            </p>
          </div>

        </div>


        {orders.length === 0 ? (

          <div className="payment-empty">
            <div>📦</div>
            <h3>Chưa có đơn hàng</h3>
            <p>
              Hiện tại chưa có dữ liệu thanh toán.
            </p>
          </div>

        ) : (

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    {/* MÃ ĐƠN */}
                    <td>
                      <span className="order-code">
                        #{order.id}
                      </span>
                    </td>


                    {/* KHÁCH HÀNG */}
                    <td>

                      <div className="customer-info">

                        <div className="customer-avatar">
                          👤
                        </div>

                        <div>
                          <strong>
                            {order.customer?.fullName ||
                              "Chưa cập nhật"}
                          </strong>

                          <span>
                            @{order.customer?.username ||
                              "-"}
                          </span>

                          <small>
                            📞{" "}
                            {order.customer?.phone ||
                              "Chưa có SĐT"}
                          </small>
                        </div>

                      </div>

                    </td>


                    {/* NGÀY */}
                    <td>
                      <div className="date-info">
                        <strong>
                          {order.orderDate
                            ? new Date(
                                order.orderDate
                              ).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </strong>

                        <span>
                          {order.orderDate
                            ? new Date(
                                order.orderDate
                              ).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </span>
                      </div>
                    </td>


                    {/* PHƯƠNG THỨC */}
                    <td>

                      <span
                        className={getPaymentClass(
                          order.paymentMethod
                        )}
                      >
                        {order.paymentMethod === "BANK"
                          ? "🏦 Chuyển khoản"
                          : "💵 COD"}
                      </span>

                    </td>


                    {/* TỔNG */}
                    <td>
                      <strong className="payment-total">
                        {formatMoney(order.total)}
                      </strong>
                    </td>


                    {/* TRẠNG THÁI */}
                    <td>

                      <span
                        className={getStatusClass(
                          order.status
                        )}
                      >
                        ● {order.status}
                      </span>

                    </td>


                    {/* CHI TIẾT */}
                    <td>

                      <button
                        className="payment-detail-btn"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                      >
                        👁 Xem
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* MODAL CHI TIẾT */}
      {selectedOrder && (

        <div
          className="payment-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >

          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="payment-modal-header">

              <div>
                <span>CHI TIẾT ĐƠN HÀNG</span>

                <h2>
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>

            </div>


            {/* KHÁCH HÀNG */}
            <div className="detail-section">

              <h3>👤 Thông tin khách hàng</h3>

              <div className="detail-grid">

                <div>
                  <span>Họ và tên</span>
                  <strong>
                    {selectedOrder.customer?.fullName}
                  </strong>
                </div>

                <div>
                  <span>Tài khoản</span>
                  <strong>
                    @{selectedOrder.customer?.username}
                  </strong>
                </div>

                <div>
                  <span>Số điện thoại</span>
                  <strong>
                    {selectedOrder.customer?.phone}
                  </strong>
                </div>

                <div>
                  <span>Địa chỉ giao hàng</span>
                  <strong>
                    📍 {selectedOrder.address}
                  </strong>
                </div>

              </div>

            </div>


            {/* SẢN PHẨM */}
            <div className="detail-section">

              <h3>🛍️ Sản phẩm</h3>

              <div className="detail-products">

                {selectedOrder.items?.map((item) => (

                  <div
                    className="detail-product"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.productName}
                    />

                    <div className="detail-product-info">

                      <strong>
                        {item.productName}
                      </strong>

                      <span>
                        {item.category}
                      </span>

                      <small>
                        Số lượng: {item.quantity}
                      </small>

                    </div>

                    <div className="detail-product-price">

                      {formatMoney(
                        item.price *
                          item.quantity
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* THANH TOÁN */}
            <div className="detail-payment">

              <div>
                <span>Phương thức</span>

                <strong>
                  {selectedOrder.paymentMethod ===
                  "BANK"
                    ? "🏦 Chuyển khoản"
                    : "💵 COD"}
                </strong>
              </div>


              <div>
                <span>Trạng thái đơn</span>

                <strong>
                  {selectedOrder.status}
                </strong>
              </div>


              <div className="detail-total">

                <span>Tổng thanh toán</span>

                <strong>
                  {formatMoney(
                    selectedOrder.total
                  )}
                </strong>

              </div>

            </div>


            {/* LƯU Ý */}
            <div className="payment-note">
              ℹ️ Hệ thống hiện đang sử dụng trạng thái
              đơn hàng làm trạng thái thanh toán.
              API chưa có trường riêng cho
              <strong> paymentStatus</strong>.
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Payment;