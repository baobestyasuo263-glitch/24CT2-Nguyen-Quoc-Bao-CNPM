import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Customers() {

  // Danh sách khách hàng
  const [customers, setCustomers] = useState([]);

  // Trạng thái loading
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LẤY DANH SÁCH KHÁCH HÀNG TỪ BACKEND
  // =====================================================

  useEffect(() => {

    fetch("/api/customers")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách khách hàng");
        }

        return response.json();
      })

      .then((data) => {

        console.log("Danh sách khách hàng:", data);

        setCustomers(data);

        setLoading(false);
      })

      .catch((error) => {

        console.error(error);

        setLoading(false);

        alert(
          "Không thể kết nối Backend!\n" +
          "Hãy kiểm tra Spring Boot có đang chạy không."
        );
      });

  }, []);


  // =====================================================
  // XÓA TÀI KHOẢN
  // =====================================================

  const deleteCustomer = async (username) => {

    // Hỏi xác nhận
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${username}" không?\n\n` +
      "Tài khoản sẽ bị xóa khỏi cơ sở dữ liệu!"
    );

    // Người dùng chọn Hủy
    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `/api/customers/${username}`,
        {
          method: "DELETE",
        }
      );

      // Xóa thất bại
      if (!response.ok) {
        throw new Error("Xóa tài khoản thất bại");
      }

      // Cập nhật lại danh sách trên giao diện
      setCustomers((oldCustomers) =>
        oldCustomers.filter(
          (customer) =>
            customer.username !== username
        )
      );

      alert("✅ Xóa tài khoản thành công!");

    } catch (error) {

      console.error(error);

      alert(
        "❌ Không thể xóa tài khoản!\n" +
        "Vui lòng kiểm tra Backend."
      );
    }
  };


  return (
    <div className="employee-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

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
            💬 Hỗ trợ
          </Link>

          <Link to="/employee/statistics">
            📈 Thống kê
          </Link>

        </nav>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="employee-main">

        {/* HEADER */}

        <header className="employee-header">

          <div>

            <h2>
              Khách hàng
            </h2>

            <p>
              Quản lý thông tin và tài khoản khách hàng
            </p>

          </div>

          <div>
            👨‍💼 Nhân viên
          </div>

        </header>


        {/* CONTENT */}

        <section className="employee-content">

          <div className="employee-panel">

            {/* TIÊU ĐỀ */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <div>

                <h2>
                  👥 Danh sách khách hàng
                </h2>

                <p
                  style={{
                    color: "#777",
                    marginTop: "5px",
                  }}
                >
                  Tổng số:{" "}
                  <b>{customers.length}</b>{" "}
                  khách hàng
                </p>

              </div>

            </div>


            {/* ĐANG TẢI */}

            {loading && (

              <div
                style={{
                  textAlign: "center",
                  padding: "50px",
                  fontSize: "16px",
                }}
              >
                ⏳ Đang tải danh sách khách hàng...
              </div>

            )}


            {/* KHÔNG CÓ KHÁCH HÀNG */}

            {!loading &&
              customers.length === 0 && (

                <div
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#777",
                  }}
                >

                  <div
                    style={{
                      fontSize: "45px",
                      marginBottom: "10px",
                    }}
                  >
                    👤
                  </div>

                  <div>
                    Chưa có khách hàng nào.
                  </div>

                </div>

              )}


            {/* BẢNG KHÁCH HÀNG */}

            {!loading &&
              customers.length > 0 && (

                <div
                  style={{
                    overflowX: "auto",
                  }}
                >

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Mã KH
                        </th>

                        <th>
                          Tài khoản
                        </th>

                        <th>
                          Họ tên
                        </th>

                        <th>
                          Số điện thoại
                        </th>

                        <th>
                          Địa chỉ
                        </th>

                        <th>
                          Thao tác
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {customers.map(
                        (customer) => (

                          <tr
                            key={customer.id}
                          >

                            {/* MÃ KH */}

                            <td>

                              <b>
                                KH
                                {String(
                                  customer.id
                                ).padStart(
                                  3,
                                  "0"
                                )}
                              </b>

                            </td>


                            {/* USERNAME */}

                            <td>

                              <b>
                                {customer.username}
                              </b>

                            </td>


                            {/* HỌ TÊN */}

                            <td>

                              {customer.fullName}

                            </td>


                            {/* PHONE */}

                            <td>

                              {customer.phone ||
                                "Chưa cập nhật"}

                            </td>


                            {/* ADDRESS */}

                            <td>

                              {customer.address ||
                                "Chưa cập nhật"}

                            </td>


                            {/* XÓA */}

                            <td>

                              <button
                                onClick={() =>
                                  deleteCustomer(
                                    customer.username
                                  )
                                }
                                style={{
                                  background:
                                    "#ff4d4f",
                                  color: "#fff",
                                  border: "none",
                                  padding:
                                    "8px 14px",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                  fontWeight:
                                    "bold",
                                }}
                              >

                                🗑️ Xóa

                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Customers;