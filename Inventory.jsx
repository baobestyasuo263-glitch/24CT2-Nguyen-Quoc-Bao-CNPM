import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Inventory() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy sản phẩm từ Backend
  const loadProducts = async () => {

    try {

      const response = await fetch(
        "/api/products"
      );

      if (!response.ok) {
        throw new Error("Không thể lấy sản phẩm");
      }

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      console.error(error);

      alert("Không thể kết nối Backend!");

    } finally {

      setLoading(false);

    }
  };


  // Thay đổi số lượng kho
  const updateStock = async (id, amount) => {

    try {

      const response = await fetch(
        `/api/products/${id}/stock?amount=${amount}`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật kho");
      }

      // Load lại dữ liệu sau khi cập nhật
      loadProducts();

    } catch (error) {

      console.error(error);

      alert("Cập nhật kho thất bại!");

    }
  };


  useEffect(() => {

    loadProducts();

  }, []);


  return (

    <div className="employee-layout">

      {/* SIDEBAR */}

      <aside className="employee-sidebar">

        <div className="employee-logo">

          🛒 SHOPWEB

          <span>NHÂN VIÊN</span>

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
            💬 Hỗ trợ khách hàng
          </Link>

          <Link to="/employee/statistics">
            📈 Thống kê
          </Link>

        </nav>

      </aside>


      {/* MAIN */}

      <main className="employee-main">

        <header className="employee-header">

          <div>

            <h2>🏪 Quản lý kho hàng</h2>

            <p>
              Kiểm tra và cập nhật số lượng sản phẩm trong kho
            </p>

          </div>

          <div className="employee-account">
            👨‍💼 Nhân viên
          </div>

        </header>


        <section className="employee-content">

          <div className="employee-panel">

            <div className="panel-header">

              <div>

                <h2>📦 Danh sách tồn kho</h2>

                <p>
                  Dữ liệu được lấy trực tiếp từ SQL Server
                </p>

              </div>

            </div>


            {loading ? (

              <p>⏳ Đang tải dữ liệu...</p>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Sản phẩm</th>

                    <th>Danh mục</th>

                    <th>Giá</th>

                    <th>Tồn kho</th>

                    <th>Thao tác</th>

                  </tr>

                </thead>


                <tbody>

                  {products.map((product) => (

                    <tr key={product.id}>

                      <td>
                        {product.id}
                      </td>


                      <td>

                        <strong>
                          {product.name}
                        </strong>

                      </td>


                      <td>
                        {product.category}
                      </td>


                      <td>

                        {Number(product.price).toLocaleString("vi-VN")}
                        đ

                      </td>


                      <td>

                        <strong
                          style={{
                            color:
                              product.stock <= 5
                                ? "#dc3545"
                                : "#198754"
                          }}
                        >
                          {product.stock}
                        </strong>

                      </td>


                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            updateStock(product.id, -1)
                          }
                        >
                          −1
                        </button>


                        <button
                          className="confirm-btn"
                          style={{
                            marginLeft: "8px"
                          }}
                          onClick={() =>
                            updateStock(product.id, 1)
                          }
                        >
                          +1
                        </button>


                        <button
                          className="confirm-btn"
                          style={{
                            marginLeft: "8px"
                          }}
                          onClick={() =>
                            updateStock(product.id, 10)
                          }
                        >
                          +10
                        </button>

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

export default Inventory;