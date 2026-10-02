import { useState } from "react";
import { Link } from "react-router-dom";

function Support() {

  const [messages, setMessages] = useState([
    {
      id: 1,
      customer: "Nguyễn Văn A",
      message: "Đơn hàng của tôi khi nào giao?",
      status: "Chưa xử lý"
    },
    {
      id: 2,
      customer: "Trần Văn B",
      message: "Tôi muốn đổi sản phẩm.",
      status: "Đang xử lý"
    }
  ]);

  const solve = (id) => {

    setMessages(
      messages.map(item =>
        item.id === id
          ? {
              ...item,
              status: "Đã giải đáp"
            }
          : item
      )
    );

  };

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
            <h2>Hỗ trợ khách hàng</h2>
            <p>Tiếp nhận và giải đáp yêu cầu</p>
          </div>

        </header>

        <section className="employee-content">

          <div className="employee-panel">

            <h2>💬 Yêu cầu hỗ trợ</h2>

            <table>

              <thead>

                <tr>
                  <th>Khách hàng</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>

              </thead>

              <tbody>

                {messages.map(item => (

                  <tr key={item.id}>

                    <td>{item.customer}</td>

                    <td>{item.message}</td>

                    <td>{item.status}</td>

                    <td>

                      {item.status !== "Đã giải đáp" && (

                        <button
                          className="confirm-btn"
                          onClick={() => solve(item.id)}
                        >
                          Đã giải đáp
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Support;