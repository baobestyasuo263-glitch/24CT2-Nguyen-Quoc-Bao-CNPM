import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const username = localStorage.getItem("employeeUsername");

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      window.location.href = "/employee/login";
      return;
    }

    fetch(
      `/api/employees/${encodeURIComponent(username)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không tìm thấy thông tin nhân viên");
        }

        return response.json();
      })
      .then((data) => {
        setEmployee(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="employee-profile-loading">
        <div className="profile-spinner"></div>
        <p>Đang tải thông tin nhân viên...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="employee-profile-error">
        <div className="error-icon">⚠️</div>
        <h2>Không tìm thấy thông tin</h2>
        <p>Không thể lấy thông tin nhân viên.</p>

        <Link to="/employee" className="profile-back-btn">
          ← Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="employee-profile-page">

      {/* SIDEBAR */}
      <aside className="employee-sidebar">

        <div className="employee-logo">
          🛒 SHOPWEB
          <span>NHÂN VIÊN</span>
        </div>

        <nav className="employee-nav">

          <Link to="/employee">
            📊 <span>Tổng quan</span>
          </Link>

          <Link to="/employee/products">
            📦 <span>Sản phẩm</span>
          </Link>

          <Link to="/employee/inventory">
            🏪 <span>Kho hàng</span>
          </Link>

          <Link to="/employee/orders">
            🧾 <span>Đơn hàng</span>
          </Link>

          <Link to="/employee/customers">
            👥 <span>Khách hàng</span>
          </Link>

          <Link to="/employee/support">
            💬 <span>Hỗ trợ khách hàng</span>
          </Link>

          <Link to="/employee/statistics">
            📈 <span>Thống kê</span>
          </Link>

        </nav>

      </aside>


      {/* MAIN */}
      <main className="employee-profile-main">

        {/* HEADER */}
        <header className="employee-profile-header">

          <div>
            <div className="profile-breadcrumb">
              SHOPWEB / NHÂN VIÊN / HỒ SƠ
            </div>

            <h1>Hồ sơ nhân viên</h1>

            <p>
              Quản lý và xem thông tin tài khoản nhân viên
            </p>
          </div>

          <Link
            to="/employee"
            className="profile-dashboard-btn"
          >
            ← Quay lại trang chủ
          </Link>

        </header>


        {/* PROFILE */}
        <section className="employee-profile-content">

          {/* CARD GIỚI THIỆU */}
          <div className="employee-profile-hero">

            <div className="employee-big-avatar">
              👨‍💼
            </div>

            <div className="employee-hero-info">

              <h2>
                {employee.fullName || employee.username}
              </h2>

              <p className="employee-username">
                @{employee.username}
              </p>

              <div className="employee-badges">

                <span className="employee-role-badge">
                  💼 {employee.role || "Nhân viên"}
                </span>

                {employee.active ? (
                  <span className="employee-active-badge">
                    ● Đang hoạt động
                  </span>
                ) : (
                  <span className="employee-locked-badge">
                    ● Đã khóa
                  </span>
                )}

              </div>

            </div>

          </div>


          {/* THÔNG TIN */}
          <div className="employee-info-card">

            <div className="employee-card-title">
              <div className="employee-card-icon">
                👤
              </div>

              <div>
                <h2>Thông tin cá nhân</h2>
                <p>Thông tin tài khoản nhân viên</p>
              </div>
            </div>


            <div className="employee-info-grid">

              <div className="employee-info-item">
                <span className="info-label">
                  Tên đăng nhập
                </span>

                <strong>
                  {employee.username}
                </strong>
              </div>


              <div className="employee-info-item">
                <span className="info-label">
                  Họ và tên
                </span>

                <strong>
                  {employee.fullName || "Chưa cập nhật"}
                </strong>
              </div>


              <div className="employee-info-item">
                <span className="info-label">
                  Số điện thoại
                </span>

                <strong>
                  {employee.phone || "Chưa cập nhật"}
                </strong>
              </div>


              <div className="employee-info-item">
                <span className="info-label">
                  Chức vụ
                </span>

                <strong>
                  {employee.role || "Nhân viên"}
                </strong>
              </div>


              <div className="employee-info-item employee-info-full">
                <span className="info-label">
                  📍 Địa chỉ
                </span>

                <strong>
                  {employee.address || "Chưa cập nhật"}
                </strong>
              </div>

            </div>

          </div>


          {/* TRẠNG THÁI */}
          <div className="employee-status-card">

            <div className="status-left">

              <div className="status-icon">
                {employee.active ? "✓" : "!"}
              </div>

              <div>
                <h3>Trạng thái tài khoản</h3>

                <p>
                  {employee.active
                    ? "Tài khoản hiện đang hoạt động bình thường."
                    : "Tài khoản hiện đang bị khóa."}
                </p>
              </div>

            </div>

            <div
              className={
                employee.active
                  ? "status-active"
                  : "status-locked"
              }
            >
              {employee.active
                ? "ĐANG HOẠT ĐỘNG"
                : "ĐÃ KHÓA"}
            </div>

          </div>


          {/* NÚT */}
          <div className="employee-profile-actions">

            <Link
              to="/employee"
              className="profile-secondary-btn"
            >
              ← Quay lại trang chủ
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;