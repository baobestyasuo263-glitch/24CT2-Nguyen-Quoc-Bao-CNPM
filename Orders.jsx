import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders() {

  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {

    try {

      const response = await fetch(
        "/api/orders"
      );

      if (response.ok) {

        const data = await response.json();

        setOrders(data);

      } else {

        alert("Không thể lấy danh sách đơn hàng!");

      }

    } catch (error) {

      console.error(error);

      alert(
        "Không thể kết nối Backend!"
      );
    }
  };


  useEffect(() => {

    loadOrders();

  }, []);


  const updateStatus = async (
    id,
    status
  ) => {

    try {

      const response = await fetch(
        `/api/orders/${id}/status?status=${encodeURIComponent(status)}`,
        {
          method: "PUT"
        }
      );


      if (response.ok) {

        // Tải lại danh sách sau khi cập nhật
        loadOrders();

        alert(
          "Cập nhật trạng thái thành công!"
        );

      } else {

        alert(
          "Cập nhật trạng thái thất bại!"
        );
      }

    } catch (error) {

      console.error(error);

      alert(
        "Không thể kết nối Backend!"
      );
    }
  };


  const renderButtons = (order) => {

    switch (order.status) {

      case "Chờ xác nhận":

        return (
          <>
            <button
              className="confirm-btn"
              onClick={() =>
                updateStatus(
                  order.id,
                  "Đã xác nhận"
                )
              }
            >
              ✅ Xác nhận
            </button>

            <button
              className="view-btn"
              onClick={() =>
                updateStatus(
                  order.id,
                  "Đã hủy"
                )
              }
            >
              ❌ Hủy
            </button>
          </>
        );


      case "Đã xác nhận":

        return (
          <button
            className="confirm-btn"
            onClick={() =>
              updateStatus(
                order.id,
                "Đang chuẩn bị"
              )
            }
          >
            📦 Chuẩn bị hàng
          </button>
        );


      case "Đang chuẩn bị":

        return (
          <button
            className="confirm-btn"
            onClick={() =>
              updateStatus(
                order.id,
                "Đang giao"
              )
            }
          >
            🚚 Giao hàng
          </button>
        );


case "Đang giao":
    return (
        <button
            className="confirm-btn"
            onClick={() =>
                updateStatus(
                    order.id,
                    "Đã giao"
                )
            }
        >
            ✅ Đã giao
        </button>
    );


      case "Đã giao":
    return (
        <span>
            ✅ Đã giao
        </span>
    );


      case "Đã hủy":

        return (
          <span>
            ❌ Đã hủy
          </span>
        );


      default:

        return null;
    }
  };


  return (
    <div className="employee-layout">

      <aside className="employee-sidebar">

        <div className="employee-logo">

          🛒 SHOPWEB

          <span>
            NHÂN VIÊN
          </span>

        </div>


        <nav>

          <Link to="/employee">
            📊 Tổng quan
          </Link>

          <Link to="/employee/products">
            📦 Sản phẩm
          </Link>

          <Link to="/employee/inventory">
            🏪 Kho hàng
          </Link>

          <Link to="/employee/orders">
            🧾 Đơn hàng
          </Link>

          <Link to="/employee/customers">
            👥 Khách hàng
          </Link>

          <Link to="/employee/support">
            💬 Hỗ trợ
          </Link>

          <Link to="/employee/statistics">
            📈 Thống kê
          </Link>

        </nav>

      </aside>


      <main className="employee-main">

        <header className="employee-header">

          <div>

            <h2>
              Quản lý đơn hàng
            </h2>

            <p>
              Tiếp nhận và xử lý đơn hàng
            </p>

          </div>

        </header>


        <section className="employee-content">

          <div className="employee-panel">

            <h2>
              🧾 Danh sách đơn hàng
            </h2>


            {orders.length === 0 ? (

              <p>
                Chưa có đơn hàng nào.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>
                      Mã đơn
                    </th>

                    <th>
                      Khách hàng ID
                    </th>

                    <th>
                      Ngày đặt
                    </th>

                    <th>
                      Địa chỉ
                    </th>

                    <th>
                      Thanh toán
                    </th>

                    <th>
                      Tổng tiền
                    </th>

                    <th>
                      Trạng thái
                    </th>

                    <th>
                      Xử lý
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {orders.map(order => (

                    <tr key={order.id}>

                      <td>
                        #DH{order.id}
                      </td>

                      <td>
                        KH{order.customerId}
                      </td>

                      <td>

                        {order.orderDate
                          ? new Date(
                              order.orderDate
                            ).toLocaleString(
                              "vi-VN"
                            )
                          : ""}

                      </td>

                      <td>
                        {order.address}
                      </td>

                      <td>
                        {order.paymentMethod}
                      </td>

                      <td>

                        {Number(
                          order.total
                        ).toLocaleString(
                          "vi-VN"
                        )}

                        đ

                      </td>

                      <td>

                        <span className="status">

                          {order.status}

                        </span>

                      </td>

                      <td>

                        {renderButtons(order)}

                      </td>

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

export default Orders;