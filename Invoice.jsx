import { Link } from "react-router-dom";

function Invoice() {

  const orders =
    JSON.parse(
      localStorage.getItem("orders")
    ) || [];

  const order = orders[orders.length - 1];

  if (!order) {

    return (
      <div className="customer-section">
        <h2>Chưa có đơn hàng để xuất hóa đơn.</h2>

        <Link to="/products">
          Mua hàng
        </Link>
      </div>
    );

  }

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice">

      <div className="invoice-box">

        <h1>🛒 SHOPWEB</h1>

        <h2>HÓA ĐƠN BÁN HÀNG</h2>

        <hr />

        <p>
          Mã đơn hàng:
          <b> #{order.id}</b>
        </p>

        <p>
          Ngày đặt:
          {order.date}
        </p>

        <p>
          Địa chỉ:
          {order.address}
        </p>

        <h3>Sản phẩm</h3>

        <table>

          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SL</th>
              <th>Thành tiền</th>
            </tr>
          </thead>

          <tbody>

            {order.items.map(item => (

              <tr key={item.id}>

                <td>{item.name}</td>

                <td>{item.quantity}</td>

                <td>
                  {(item.price * item.quantity)
                    .toLocaleString()}đ
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <h2>
          Tổng tiền:
          {order.total.toLocaleString()}đ
        </h2>

        <p>
          Phương thức thanh toán:
          {order.payment}
        </p>

        <button
          className="main-btn"
          onClick={printInvoice}
        >
          🖨️ Xuất hóa đơn
        </button>

      </div>

    </div>
  );
}

export default Invoice;