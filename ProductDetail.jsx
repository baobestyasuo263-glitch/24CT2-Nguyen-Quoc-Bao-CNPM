import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // =========================
    // LẤY SẢN PHẨM
    // =========================
    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Không tìm thấy sản phẩm");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [id]);

    // =========================
    // THÊM VÀO GIỎ
    // =========================
    const addToCart = () => {
        if (localStorage.getItem("customerLogin") !== "true") {
            alert("Vui lòng đăng nhập trước khi mua hàng!");
            navigate("/login");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(
            (item) => Number(item.id) === Number(product.id)
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        localStorage.removeItem("buyNowProduct");
        localStorage.removeItem("checkoutMode");

        alert("Đã thêm sản phẩm vào giỏ hàng!");
    };

    // =========================
    // MUA NGAY
    // =========================
    const buyNow = () => {
        if (localStorage.getItem("customerLogin") !== "true") {
            alert("Vui lòng đăng nhập trước khi mua hàng!");
            navigate("/login");
            return;
        }

        const buyNowProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        };

        localStorage.setItem(
            "buyNowProduct",
            JSON.stringify(buyNowProduct)
        );

        localStorage.setItem("checkoutMode", "buyNow");

        navigate("/checkout");
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="detail-loading">
                <div className="detail-spinner"></div>
                <h3>Đang tải sản phẩm...</h3>
                <p>Vui lòng chờ một chút</p>
            </div>
        );
    }

    // =========================
    // KHÔNG TÌM THẤY
    // =========================
    if (!product) {
        return (
            <div className="detail-not-found">
                <div className="not-found-icon">😢</div>
                <h2>Không tìm thấy sản phẩm</h2>
                <button onClick={() => navigate("/products")}>
                    ← Quay lại sản phẩm
                </button>
            </div>
        );
    }

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="product-detail-page">

            {/* =========================
                HEADER / BREADCRUMB
            ========================= */}
            <div className="detail-container">

                <div className="detail-breadcrumb">
                    <span onClick={() => navigate("/")}>Trang chủ</span>
                    <b>›</b>

                    <span onClick={() => navigate("/products")}>
                        Sản phẩm
                    </span>

                    <b>›</b>

                    <span className="current">
                        {product.name}
                    </span>
                </div>


                {/* =========================
                    PRODUCT MAIN
                ========================= */}
                <div className="product-detail-card">

                    {/* IMAGE */}
                    <div className="product-detail-left">

                        <div className="product-image-box">

                            <img
                                src={product.image}
                                alt={product.name}
                            />

                            <div className="image-badge">
                                SHOPWEB
                            </div>

                        </div>

                        <div className="product-image-note">
                            🛡️ Hình ảnh sản phẩm chính hãng
                        </div>

                    </div>


                    {/* INFO */}
                    <div className="product-detail-info">

                        <div className="product-detail-category">
                            {product.category}
                        </div>


                        <h1 className="product-detail-title">
                            {product.name}
                        </h1>


                        {/* RATING */}
                        <div className="product-rating">

                            <span className="rating-number">
                                4.9
                            </span>

                            <span className="stars">
                                ★★★★★
                            </span>

                            <span className="rating-line"></span>

                            <span>
                                128 Đánh giá
                            </span>

                            <span className="rating-line"></span>

                            <span>
                                Đã bán 500+
                            </span>

                        </div>


                        {/* PRICE */}
                        <div className="product-price-box">

                            <span className="product-price">
                                {Number(product.price).toLocaleString("vi-VN")} ₫
                            </span>

                            <span className="price-tag">
                                GIẢM GIÁ
                            </span>

                        </div>


                        {/* PROMOTION */}
                        <div className="promotion-box">

                            <div className="promotion-title">
                                🎁 ƯU ĐÃI
                            </div>

                            <div className="promotion-item">
                                <span className="voucher">
                                    GIẢM 10%
                                </span>
                                <span>
                                    Giảm giá cho đơn hàng hôm nay
                                </span>
                            </div>

                            <div className="promotion-item">
                                <span className="voucher">
                                    FREESHIP
                                </span>
                                <span>
                                    Miễn phí vận chuyển
                                </span>
                            </div>

                        </div>


                        {/* SHIPPING */}
                        <div className="shipping-box">

                            <div className="shipping-row">
                                <span className="shipping-icon">🚚</span>

                                <div>
                                    <strong>Vận chuyển</strong>

                                    <p>
                                        Miễn phí vận chuyển toàn quốc
                                    </p>
                                </div>
                            </div>

                            <div className="shipping-row">
                                <span className="shipping-icon">🛡️</span>

                                <div>
                                    <strong>Bảo đảm</strong>

                                    <p>
                                        Hàng chính hãng · Đổi trả dễ dàng
                                    </p>
                                </div>
                            </div>

                        </div>


                        {/* STOCK */}
                        <div className="stock-info">

                            <span>Số lượng</span>

                            <span className="stock-text">
                                📦 Còn {product.stock} sản phẩm
                            </span>

                        </div>


                        {/* QUANTITY */}
                        <div className="quantity-section">

                            <span className="quantity-label">
                                Số lượng
                            </span>

                            <div className="quantity-control">

                                <button
                                    disabled={quantity <= 1}
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(1, quantity - 1)
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    disabled={
                                        quantity >= product.stock
                                    }
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                quantity + 1
                                            )
                                        )
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        {/* BUTTONS */}
                        <div className="product-detail-buttons">

                            <button
                                className="add-cart-btn"
                                onClick={addToCart}
                                disabled={isOutOfStock}
                            >
                                🛒
                                <span>
                                    Thêm vào giỏ hàng
                                </span>
                            </button>


                            <button
                                className="buy-now-btn"
                                onClick={buyNow}
                                disabled={isOutOfStock}
                            >
                                Mua ngay
                            </button>

                        </div>


                        {/* BENEFITS */}
                        <div className="shop-benefits">

                            <div>
                                <span>🛡️</span>
                                <p>
                                    <strong>Hàng chính hãng</strong>
                                    <small>Cam kết chất lượng</small>
                                </p>
                            </div>

                            <div>
                                <span>🚚</span>
                                <p>
                                    <strong>Giao hàng nhanh</strong>
                                    <small>Toàn quốc</small>
                                </p>
                            </div>

                            <div>
                                <span>↩️</span>
                                <p>
                                    <strong>Đổi trả</strong>
                                    <small>Trong 7 ngày</small>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    DESCRIPTION
                ========================= */}
                <div className="product-description-card">

                    <div className="description-header">
                        CHI TIẾT SẢN PHẨM
                    </div>

                    <div className="description-content">

                        <div className="description-row">
                            <span>Danh mục</span>
                            <strong>{product.category}</strong>
                        </div>

                        <div className="description-row">
                            <span>Tình trạng</span>

                            <strong className={
                                product.stock > 0
                                    ? "in-stock"
                                    : "out-stock"
                            }>
                                {product.stock > 0
                                    ? "Còn hàng"
                                    : "Hết hàng"}
                            </strong>
                        </div>

                        <div className="description-row">
                            <span>Kho hàng</span>
                            <strong>
                                {product.stock} sản phẩm
                            </strong>
                        </div>

                        {product.description && (
                            <div className="description-text">
                                <h3>Mô tả sản phẩm</h3>
                                <p>{product.description}</p>
                            </div>
                        )}

                    </div>

                </div>


                {/* BACK BUTTON */}
                <button
                    className="back-products-btn"
                    onClick={() => navigate("/products")}
                >
                    ← Tiếp tục xem sản phẩm
                </button>

            </div>

        </div>
    );
}

export default ProductDetail;