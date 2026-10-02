import { Link } from "react-router-dom";
import products from "../../data/products";

function Home() {

  const isLogin = localStorage.getItem("customerLogin") === "true";
  const username = localStorage.getItem("username");
  const customerName = localStorage.getItem("customerName");

  const handleLogout = () => {
    localStorage.removeItem("customerLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("customerName");

    window.location.href = "/";
  };

  return (
    <div>

      {/* HEADER */}
<header className="customer-header">

  <Link to="/" className="logo">
    SHOPWEB
  </Link>

  <Link to="/products">
    Sản phẩm
  </Link>

  <Link to="/cart">
    🛒 Giỏ hàng
  </Link>

  {isLogin ? (
    <div className="account-menu">

      {/* Tài khoản */}
      <button className="account-button">
        👤 {username} ▼
      </button>

      {/* MENU XỔ XUỐNG */}
      <div className="account-dropdown">

        <Link to="/profile">
          👤 Tài Khoản Của Tôi
        </Link>

        <Link to="/orders">
          📦 Đơn Mua
        </Link>

        <button onClick={handleLogout}>
          🚪 Đăng Xuất
        </button>

      </div>

    </div>
  ) : (
    <>
      <Link to="/login">
        Đăng nhập
      </Link>

      <Link to="/register">
        Đăng ký
      </Link>
    </>
  )}

</header>


      {/* HERO */}
      <section className="hero">

        <div>

          <h1>
            Chào mừng đến với SHOPWEB
          </h1>

          {isLogin ? (
            <p>
              Xin chào <strong>{customerName || username}</strong> 👋
            </p>
          ) : (
            <p>
              Mua sắm trực tuyến đơn giản và tiện lợi
            </p>
          )}

         <Link to="/products" className="main-btn">
  Xem sản phẩm
</Link>

        </div>

      </section>


      {/* THÔNG TIN TÀI KHOẢN */}
      {isLogin && (
        <section className="customer-section">

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px"
            }}
          >

            <h2>
              👤 Tài khoản của bạn
            </h2>

            <p>
              Tên đăng nhập: <strong>{username}</strong>
            </p>

            <p>
              Họ và tên: <strong>{customerName}</strong>
            </p>

            <Link
              to="/profile"
              className="main-btn"
            >
              Xem thông tin tài khoản
            </Link>

          </div>

        </section>
      )}


      {/* DANH MỤC */}
      <section className="customer-section">

        <h2>Danh mục sản phẩm</h2>

        <div className="category-grid">

          <Link to="/products?category=Điện thoại">
            📱 Điện thoại
          </Link>

          <Link to="/products?category=Laptop">
            💻 Laptop
          </Link>

          <Link to="/products?category=Phụ kiện">
            🎧 Phụ kiện
          </Link>

        </div>

      </section>


      {/* SẢN PHẨM */}
      <section className="customer-section">

        <h2>Sản phẩm nổi bật</h2>

        <div className="product-grid">

          {products.slice(0, 4).map((product) => (

            <div className="product-card" key={product.id}>

              <img
                src={product.image}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p className="price">
                {product.price.toLocaleString("vi-VN")} đ
              </p>
<Link
  to={`/products/${product.id}`}
  className="main-btn"
>
  Xem chi tiết
</Link>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;