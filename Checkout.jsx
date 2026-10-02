import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(true);

    // =========================
    // KHUYẾN MÃI
    // =========================
    const [promotionCode, setPromotionCode] = useState("");
    const [promotion, setPromotion] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [promotionMessage, setPromotionMessage] = useState("");

    // =========================
    // LẤY SẢN PHẨM
    // =========================
    useEffect(() => {
        const checkoutMode =
            localStorage.getItem("checkoutMode");

        if (checkoutMode === "buyNow") {
            const buyNowProduct =
                JSON.parse(
                    localStorage.getItem("buyNowProduct")
                );

            if (buyNowProduct) {
                setItems([buyNowProduct]);
            } else {
                setItems([]);
            }
        } else {
            const cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

            setItems(cart);
        }

        setLoading(false);
    }, []);

    // =========================
    // TỔNG TIỀN GỐC
    // =========================
    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    // =========================
    // ÁP DỤNG MÃ KHUYẾN MÃI
    // =========================
    const applyPromotion = async () => {

        if (!promotionCode.trim()) {
            setPromotionMessage(
                "⚠ Vui lòng nhập mã khuyến mãi!"
            );
            setPromotion(null);
            setDiscount(0);
            return;
        }

        try {

            const response = await fetch(
                `/api/promotions/code/${promotionCode.trim()}`
            );

            if (!response.ok) {
                setPromotionMessage(
                    "❌ Mã khuyến mãi không tồn tại!"
                );
                setPromotion(null);
                setDiscount(0);
                return;
            }

            const data = await response.json();

            // Kiểm tra trạng thái
            if (!data.active) {
                setPromotionMessage(
                    "❌ Mã khuyến mãi đã bị tắt!"
                );
                setPromotion(null);
                setDiscount(0);
                return;
            }

            // Kiểm tra thời gian
            const now = new Date();
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (now < startDate) {
                setPromotionMessage(
                    "❌ Mã khuyến mãi chưa bắt đầu!"
                );
                setPromotion(null);
                setDiscount(0);
                return;
            }

            if (now > endDate) {
                setPromotionMessage(
                    "❌ Mã khuyến mãi đã hết hạn!"
                );
                setPromotion(null);
                setDiscount(0);
                return;
            }

            // Kiểm tra đơn tối thiểu
            if (
                total <
                Number(data.minOrderValue || 0)
            ) {
                setPromotionMessage(
                    `❌ Đơn hàng tối thiểu ${Number(
                        data.minOrderValue
                    ).toLocaleString("vi-VN")}đ`
                );

                setPromotion(null);
                setDiscount(0);
                return;
            }

            // =========================
            // TÍNH GIẢM GIÁ
            // =========================

            let discountAmount = 0;

            if (data.discountType === "PERCENT") {

                discountAmount =
                    total *
                    Number(data.discountValue) /
                    100;

            } else {

                discountAmount =
                    Number(data.discountValue);
            }

            // Không cho giảm quá tổng tiền
            discountAmount =
                Math.min(
                    discountAmount,
                    total
                );

            setPromotion(data);
            setDiscount(discountAmount);

            setPromotionMessage(
                `✅ Áp dụng mã ${data.code} thành công!`
            );

        } catch (error) {

            console.error(error);

            setPromotionMessage(
                "❌ Không thể kiểm tra mã khuyến mãi!"
            );

            setPromotion(null);
            setDiscount(0);
        }
    };

    // =========================
    // TỔNG SAU GIẢM
    // =========================
    const finalTotal =
        Math.max(
            0,
            total - discount
        );

    // =========================
    // ĐẶT HÀNG
    // =========================
    const handleOrder = async () => {

        if (items.length === 0) {
            alert(
                "Không có sản phẩm để thanh toán!"
            );
            return;
        }

        const username =
            localStorage.getItem("username");

        if (!username) {
            alert("Vui lòng đăng nhập!");
            navigate("/login");
            return;
        }

        if (!address.trim()) {
            alert(
                "Vui lòng nhập địa chỉ giao hàng!"
            );
            return;
        }

        const orderData = {

            username: username,

            address: address,

            paymentMethod: paymentMethod,

            promotionCode:
                promotion
                    ? promotion.code
                    : null,

            items: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {

            const response = await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(orderData)
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data ||
                    "Đặt hàng thất bại!"
                );
            }

            alert(
                `🎉 Đặt hàng thành công!\n\n` +
                `Tổng tiền: ${Number(
                    data.total
                ).toLocaleString("vi-VN")} ₫`
            );

            const checkoutMode =
                localStorage.getItem(
                    "checkoutMode"
                );

            if (checkoutMode === "cart") {
                localStorage.removeItem("cart");
            }

            if (checkoutMode === "buyNow") {
                localStorage.removeItem(
                    "buyNowProduct"
                );
            }

            localStorage.removeItem(
                "checkoutMode"
            );

            navigate("/orders");

        } catch (error) {

            console.error(error);

            alert(
                "Không thể đặt hàng: " +
                error.message
            );
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div style={{ padding: "40px" }}>
                Đang tải...
            </div>
        );
    }

    // =========================
    // KHÔNG CÓ SẢN PHẨM
    // =========================
    if (items.length === 0) {
        return (
            <div
                style={{
                    padding: "60px",
                    textAlign: "center"
                }}
            >
                <h2>
                    🛒 Không có sản phẩm để thanh toán
                </h2>

                <p>
                    Bạn chưa chọn sản phẩm nào.
                </p>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                    style={{
                        padding: "12px 25px",
                        marginTop: "20px",
                        cursor: "pointer"
                    }}
                >
                    ← Tiếp tục mua hàng
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            <h1>Thanh toán</h1>

            {/* =========================
                DANH SÁCH SẢN PHẨM
            ========================== */}

            <div className="checkout-products">

                {items.map((item) => (

                    <div
                        className="checkout-item"
                        key={item.id}
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                            width="100"
                        />

                        <div>

                            <h3>
                                {item.name}
                            </h3>

                            <p>
                                Giá:{" "}
                                {Number(
                                    item.price
                                ).toLocaleString(
                                    "vi-VN"
                                )} ₫
                            </p>

                            <p>
                                Số lượng:{" "}
                                {item.quantity}
                            </p>

                            <strong>
                                Thành tiền:{" "}
                                {(
                                    Number(item.price) *
                                    Number(item.quantity)
                                ).toLocaleString(
                                    "vi-VN"
                                )} ₫
                            </strong>

                        </div>

                    </div>

                ))}

            </div>


            {/* =========================
                THÔNG TIN GIAO HÀNG
            ========================== */}

            <div className="checkout-form">

                <h2>
                    Thông tin giao hàng
                </h2>

                <input
                    type="text"
                    placeholder="Nhập địa chỉ giao hàng"
                    value={address}
                    onChange={(e) =>
                        setAddress(e.target.value)
                    }
                />


                <h3>
                    Phương thức thanh toán
                </h3>

                <select
                    value={paymentMethod}
                    onChange={(e) =>
                        setPaymentMethod(
                            e.target.value
                        )
                    }
                >

                    <option value="COD">
                        Thanh toán khi nhận hàng (COD)
                    </option>

                    <option value="BANK">
                        Chuyển khoản ngân hàng
                    </option>

                </select>

            </div>


            {/* =========================
                KHUYẾN MÃI
            ========================== */}

            <div className="checkout-promotion">

                <h2>
                    🎁 Mã khuyến mãi
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: "10px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá..."
                        value={promotionCode}
                        onChange={(e) =>
                            setPromotionCode(
                                e.target.value.toUpperCase()
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={applyPromotion}
                    >
                        Áp dụng
                    </button>

                </div>

                {promotionMessage && (
                    <p
                        style={{
                            marginTop: "10px",
                            color:
                                promotion
                                    ? "green"
                                    : "red"
                        }}
                    >
                        {promotionMessage}
                    </p>
                )}

            </div>


            {/* =========================
                TỔNG TIỀN
            ========================== */}

            <div className="checkout-total">

                <p>
                    Tạm tính:{" "}
                    <strong>
                        {total.toLocaleString(
                            "vi-VN"
                        )} ₫
                    </strong>
                </p>

                {discount > 0 && (
                    <p
                        style={{
                            color: "green"
                        }}
                    >
                        Giảm giá: -
                        {discount.toLocaleString(
                            "vi-VN"
                        )} ₫
                    </p>
                )}

                <h2>

                    Tổng thanh toán:{" "}

                    <span>

                        {finalTotal.toLocaleString(
                            "vi-VN"
                        )} ₫

                    </span>

                </h2>

                <button
                    onClick={handleOrder}
                >
                    Đặt hàng
                </button>

            </div>

        </div>
    );
}

export default Checkout;