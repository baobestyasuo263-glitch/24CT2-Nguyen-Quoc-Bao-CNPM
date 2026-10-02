import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {

    const [products, setProducts] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        stock: ""
    });

    const [adding, setAdding] = useState(false);

    // Sản phẩm đang được sửa
    const [editingProduct, setEditingProduct] = useState(null);


    // ==========================================
    // LẤY SẢN PHẨM
    // ==========================================

    const loadProducts = () => {

        setLoading(true);

        fetch("/api/products")

            .then((response) => {

                if (!response.ok) {
                    throw new Error("Không thể lấy sản phẩm");
                }

                return response.json();
            })

            .then((data) => {
                setProducts(data);
            })

            .catch((error) => {
                console.error(error);
                alert("Không thể kết nối với backend!");
            })

            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        loadProducts();
    }, []);


    // ==========================================
    // THAY ĐỔI FORM
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // ==========================================
    // THÊM SẢN PHẨM
    // ==========================================

    const handleAddProduct = async (e) => {

        e.preventDefault();

        // Kiểm tra
        if (!form.name.trim()) {
            alert("Vui lòng nhập tên sản phẩm!");
            return;
        }

        if (!form.category.trim()) {
            alert("Vui lòng nhập danh mục!");
            return;
        }

        if (!form.price || Number(form.price) <= 0) {
            alert("Giá sản phẩm không hợp lệ!");
            return;
        }

        if (!form.stock || Number(form.stock) < 0) {
            alert("Số lượng sản phẩm không hợp lệ!");
            return;
        }


        setAdding(true);

        try {

            const response = await fetch(
                "/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: form.name,
                        category: form.category,
                        price: Number(form.price),
                        image: form.image,
                        description: form.description,
                        stock: Number(form.stock)
                    })
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Không thể thêm sản phẩm"
                );
            }


            const newProduct =
                await response.json();


            // Thêm ngay vào danh sách
            setProducts((prev) => [
                ...prev,
                newProduct
            ]);


            // Reset form
            setForm({
                name: "",
                category: "",
                price: "",
                image: "",
                description: "",
                stock: ""
            });


            setShowAddForm(false);

            alert("🎉 Thêm sản phẩm thành công!");

        } catch (error) {

            console.error(error);

            alert(
                "Thêm sản phẩm thất bại!"
            );

        } finally {

            setAdding(false);

        }
    };


    // ==========================================
    // SỬA SẢN PHẨM
    // ==========================================

    const handleEditProduct = (product) => {
        setEditingProduct(product);

        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price ?? "",
            image: product.image || "",
            description: product.description || "",
            stock: product.stock ?? ""
        });

        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Vui lòng nhập tên sản phẩm!");
            return;
        }

        if (!form.category.trim()) {
            alert("Vui lòng nhập danh mục!");
            return;
        }

        if (!form.price || Number(form.price) <= 0) {
            alert("Giá sản phẩm không hợp lệ!");
            return;
        }

        if (form.stock === "" || Number(form.stock) < 0) {
            alert("Số lượng sản phẩm không hợp lệ!");
            return;
        }

        setAdding(true);

        try {
            const response = await fetch(
                `/api/products/${editingProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: form.name,
                        category: form.category,
                        price: Number(form.price),
                        image: form.image,
                        description: form.description,
                        stock: Number(form.stock)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Không thể cập nhật sản phẩm");
            }

            const updatedProduct = await response.json();

            setProducts((prev) =>
                prev.map((product) =>
                    product.id === updatedProduct.id
                        ? updatedProduct
                        : product
                )
            );

            setForm({
                name: "",
                category: "",
                price: "",
                image: "",
                description: "",
                stock: ""
            });

            setEditingProduct(null);
            setShowAddForm(false);

            alert("✅ Cập nhật sản phẩm thành công!");
        } catch (error) {
            console.error(error);
            alert("❌ Cập nhật sản phẩm thất bại!");
        } finally {
            setAdding(false);
        }
        
    };
    const handleDeleteProduct = async (id, name) => {
    const confirmed = window.confirm(
        `Bạn có chắc muốn xóa sản phẩm "${name}" không?`
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `/api/products/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Không thể xóa sản phẩm");
        }

        setProducts((prev) =>
            prev.filter((product) => product.id !== id)
        );

        alert("🗑️ Xóa sản phẩm thành công!");
    } catch (error) {
        console.error(error);
        alert("❌ Xóa sản phẩm thất bại!");
    }
};

    return (

        <div className="employee-layout">

            {/* =====================================
                SIDEBAR
            ====================================== */}

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


            {/* =====================================
                MAIN
            ====================================== */}

            <main className="employee-main">

                {/* HEADER */}

                <header className="employee-header">

                    <div>

                        <h2>
                            Danh sách sản phẩm
                        </h2>

                        <p>
                            Quản lý sản phẩm SHOPWEB
                        </p>

                    </div>


                    <button
                        className="employee-add-product-btn"
                        onClick={() =>
                            setShowAddForm(true)
                        }
                    >
                        ➕ Thêm sản phẩm
                    </button>

                </header>


                <section className="employee-content">


                    {/* =====================================
                        FORM THÊM SẢN PHẨM
                    ====================================== */}

                    {showAddForm && (

                        <div className="employee-add-product-card">

                            <div className="add-product-title">

                                <div>
                                    <h2>
                                        {editingProduct
                                            ? "✏️ Sửa sản phẩm"
                                            : "➕ Thêm sản phẩm mới"}
                                    </h2>

                                    <p>
                                        {editingProduct
                                            ? "Cập nhật thông tin sản phẩm"
                                            : "Nhập thông tin sản phẩm"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="close-add-product"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingProduct(null);
                                        setForm({
                                            name: "",
                                            category: "",
                                            price: "",
                                            image: "",
                                            description: "",
                                            stock: ""
                                        });
                                    }}
                                >
                                    ×
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    editingProduct
                                        ? handleUpdateProduct
                                        : handleAddProduct
                                }
                            >

                                {/* TÊN */}

                                <div className="employee-form-group">

                                    <label>
                                        Tên sản phẩm *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: iPhone 17 Pro Max"
                                    />

                                </div>


                                {/* CATEGORY + PRICE */}

                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Danh mục *
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            placeholder="Ví dụ: Điện thoại"
                                        />

                                    </div>


                                    <div className="employee-form-group">

                                        <label>
                                            Giá sản phẩm *
                                        </label>

                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            placeholder="29990000"
                                            min="0"
                                        />

                                    </div>

                                </div>


                                {/* STOCK + IMAGE */}

                                <div className="employee-form-row">

                                    <div className="employee-form-group">

                                        <label>
                                            Số lượng *
                                        </label>

                                        <input
                                            type="number"
                                            name="stock"
                                            value={form.stock}
                                            onChange={handleChange}
                                            placeholder="100"
                                            min="0"
                                        />

                                    </div>


                                    <div className="employee-form-group">

                                        <label>
                                            Link hình ảnh
                                        </label>

                                        <input
                                            type="text"
                                            name="image"
                                            value={form.image}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                        />

                                    </div>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="employee-form-group">

                                    <label>
                                        Mô tả sản phẩm
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Nhập mô tả sản phẩm..."
                                        rows="5"
                                    />

                                </div>


                                {/* BUTTON */}

                                <div className="employee-form-actions">

                                    <button
                                        type="button"
                                        className="employee-cancel-btn"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingProduct(null);
                                            setForm({
                                                name: "",
                                                category: "",
                                                price: "",
                                                image: "",
                                                description: "",
                                                stock: ""
                                            });
                                        }}
                                    >
                                        Hủy
                                    </button>


                                    <button
                                        type="submit"
                                        className="employee-save-product-btn"
                                        disabled={adding}
                                    >
                                        {adding
                                            ? (editingProduct
                                                ? "⏳ Đang lưu..."
                                                : "⏳ Đang thêm...")
                                            : (editingProduct
                                                ? "💾 Lưu thay đổi"
                                                : "🛒 Thêm sản phẩm")}
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* =====================================
                        DANH SÁCH
                    ====================================== */}

                    <div className="employee-panel">

                        <div className="employee-panel-header">

                            <div>

                                <h2>
                                    📦 Sản phẩm
                                </h2>

                                <p>
                                    Tổng cộng {products.length} sản phẩm
                                </p>

                            </div>

                            <button
                                className="employee-refresh-btn"
                                onClick={loadProducts}
                            >
                                🔄 Làm mới
                            </button>

                        </div>


                        {loading ? (

                            <div className="employee-products-loading">
                                ⏳ Đang tải sản phẩm...
                            </div>

                        ) : products.length === 0 ? (

                            <div className="employee-products-empty">

                                <div>📦</div>

                                <h3>
                                    Chưa có sản phẩm
                                </h3>

                                <p>
                                    Hãy thêm sản phẩm đầu tiên.
                                </p>

                            </div>

                        ) : (

                            <div className="employee-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Sản phẩm
                                            </th>

                                            <th>
                                                Danh mục
                                            </th>

                                            <th>
                                                Giá
                                            </th>

                                            <th>
                                                Tồn kho
                                            </th>

                                            <th>
                                                Trạng thái
                                            </th>

                                            

                                            <th>
                                                Thao tác
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {products.map(
                                            (product) => (

                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                >

                                                    <td>
                                                        #{product.id}
                                                    </td>


                                                    <td>

                                                        <div className="employee-product-cell">

                                                            <div className="employee-product-image">

                                                                {product.image ? (

                                                                    <img
                                                                        src={
                                                                            product.image
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                    />

                                                                ) : (

                                                                    <span>
                                                                        📦
                                                                    </span>

                                                                )}

                                                            </div>


                                                            <div>

                                                                <b>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </b>

                                                                <small>
                                                                    {
                                                                        product.description ||
                                                                        "Chưa có mô tả"
                                                                    }
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>
                                                        {
                                                            product.category
                                                        }
                                                    </td>


                                                    <td className="employee-price">

                                                        {Number(
                                                            product.price
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}{" "}
                                                        ₫

                                                    </td>


                                                    <td>
                                                        {
                                                            product.stock
                                                        }
                                                    </td>


                                                    <td>

                                                        {product.stock >
                                                        5 ? (

                                                            <span className="employee-stock-good">
                                                                🟢 Còn hàng
                                                            </span>

                                                        ) : product.stock >
                                                          0 ? (

                                                            <span className="employee-stock-warning">
                                                                🟡 Sắp hết
                                                            </span>

                                                        ) : (

                                                            <span className="employee-stock-out">
                                                                🔴 Hết hàng
                                                            </span>

                                                        )}

                                                    </td>
                                                    <td>
    <button
        className="employee-delete-btn"
        onClick={() =>
            handleDeleteProduct(
                product.id,
                product.name
            )
        }
    >
        🗑️ Xóa
    </button>
</td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="employee-edit-product-btn"
                                                            onClick={() =>
                                                                handleEditProduct(product)
                                                            }
                                                        >
                                                            ✏️ Sửa
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

export default Products;