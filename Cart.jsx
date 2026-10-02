import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const isLogin =
    localStorage.getItem("customerLogin") === "true";

  const username =
    localStorage.getItem("username");


  useEffect(() => {

    if (!isLogin) {
      navigate("/login");
      return;
    }

    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);

  }, [isLogin, navigate]);


  const updateCart = (newCart) => {

    setCart(newCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(newCart)
    );

  };


  const increase = (id) => {

    const newCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    );

    updateCart(newCart);
  };


  const decrease = (id) => {

    const newCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(
              1,
              item.quantity - 1
            )
          }
        : item
    );

    updateCart(newCart);
  };


  const removeItem = (id) => {

    const newCart =
      cart.filter((item) => item.id !== id);

    updateCart(newCart);

  };


  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


  if (!isLogin) {
    return null;
  }


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

        <Link to="/orders">
          📦 Đơn hàng
        </Link>

        <Link to="/profile">
          👤 {username}
        </Link>

      </header>


      <section className="customer-section">

        <h1>🛒 Giỏ hàng</h1>


        {cart.length === 0 ? (

          <div className="cart-total">

            <h2>Giỏ hàng đang trống</h2>

            <Link
              to="/products"
              className="main-btn"
            >
              Tiếp tục mua hàng
            </Link>

          </div>

        ) : (

          <>

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div style={{ flex: 1 }}>

                  <h3>
                    {item.name}
                  </h3>

                  <p className="price">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>

                  <div>

                    <button
                      onClick={() =>
                        decrease(item.id)
                      }
                    >
                      −
                    </button>

                    <span className="quantity">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increase(item.id)
                      }
                    >
                      +
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Xóa
                    </button>

                  </div>

                </div>

              </div>

            ))}


            <div className="cart-total">

              <h2>
                Tổng tiền:{" "}
                <span className="price">
                  {total.toLocaleString("vi-VN")} đ
                </span>
              </h2>

              <button
  className="main-btn"
  onClick={() => {
    // Báo cho Checkout biết đang thanh toán từ giỏ hàng
    localStorage.setItem("checkoutMode", "cart");

    // Xóa sản phẩm "Mua ngay" cũ nếu còn
    localStorage.removeItem("buyNowProduct");

    // Chuyển sang trang thanh toán
    navigate("/checkout");
  }}
>
  Đặt hàng
</button>
            </div>

          </>

        )}

      </section>

    </div>
  );
}

export default Cart;