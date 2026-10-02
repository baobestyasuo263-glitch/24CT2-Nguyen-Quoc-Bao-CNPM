import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="top-bar">
        <div className="header-container">
          <span>Kênh người bán</span>
          <span>Trợ giúp</span>
        </div>
      </div>

      <header className="header">
        <div className="header-container">

          <Link to="/" className="logo">
            🛒 SHOPWEB
          </Link>

          <div className="search">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
            />

            <button>
              🔍
            </button>
          </div>

          <Link to="/cart" className="cart">
            🛒
          </Link>

          <Link to="/login" className="login-link">
            Đăng nhập
          </Link>

        </div>
      </header>

      <nav className="navigation">
        <div className="header-container">

          <Link to="/">
            Trang chủ
          </Link>

          <Link to="/products">
            Sản phẩm
          </Link>

          <Link to="/products">
            Danh mục
          </Link>

          <Link to="/products">
            Khuyến mãi
          </Link>

          <Link to="/orders">
            Đơn mua
          </Link>

          <Link to="/profile">
            Tài khoản
          </Link>

        </div>
      </nav>
    </>
  );
}

export default Header;