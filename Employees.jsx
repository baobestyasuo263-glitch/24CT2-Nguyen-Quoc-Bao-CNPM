import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    // Nhân viên đang sửa / xem
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Chế độ sửa
    const [editing, setEditing] = useState(false);

    // Form
    const [form, setForm] = useState({
        username: "",
        password: "",
        fullName: "",
        phone: "",
        address: "",
        position: "",
    });

    // =====================================================
    // LẤY DANH SÁCH NHÂN VIÊN
    // =====================================================

    const loadEmployees = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/employees"
            );

            if (!response.ok) {
                throw new Error("Không thể lấy danh sách nhân viên");
            }

            const data = await response.json();

            console.log("DATA EMPLOYEES:", data);

            setEmployees(data);
        } catch (error) {
            console.error(error);

            alert("❌ Không thể kết nối với backend!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    // =====================================================
    // THAY ĐỔI FORM
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // MỞ FORM THÊM
    // =====================================================

    const openAddForm = () => {
        setEditing(false);

        setSelectedEmployee(null);

        setForm({
            username: "",
            password: "",
            fullName: "",
            phone: "",
            address: "",
            position: "",
        });

        setShowForm(true);
    };

    // =====================================================
    // MỞ FORM SỬA
    // =====================================================

    const openEditForm = (employee) => {
        setEditing(true);

        setSelectedEmployee(employee);

        setForm({
            username: employee.username || "",
            password: "",
            fullName: employee.fullName || "",
            phone: employee.phone || "",
            address: employee.address || "",
            position: employee.position || "",
        });

        setShowForm(true);
    };

    // =====================================================
    // THÊM / SỬA NHÂN VIÊN
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu
        if (!form.username.trim()) {
            alert("⚠️ Vui lòng nhập username!");
            return;
        }

        if (!editing && !form.password.trim()) {
            alert("⚠️ Vui lòng nhập mật khẩu!");
            return;
        }

        if (!form.fullName.trim()) {
            alert("⚠️ Vui lòng nhập họ tên!");
            return;
        }

        try {
            let response;

            // =============================================
            // THÊM
            // =============================================

            if (!editing) {
                response = await fetch(
                    "/api/employees",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: form.username,
                            password: form.password,
                            fullName: form.fullName,
                            phone: form.phone,
                            address: form.address,
                            position: form.position,
                            active: true,
                        }),
                    }
                );
            }

            // =============================================
            // SỬA
            // =============================================

            else {
                const updateData = {
                    fullName: form.fullName,
                    phone: form.phone,
                    address: form.address,
                    position: form.position,
                };

                // Nếu nhập mật khẩu mới thì mới gửi
                if (form.password.trim()) {
                    updateData.password = form.password;
                }

                response = await fetch(
                    `/api/employees/${encodeURIComponent(
                        selectedEmployee.username
                    )}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updateData),
                    }
                );
            }

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText || "Không thể lưu nhân viên"
                );
            }

            if (editing) {
                alert("✅ Cập nhật nhân viên thành công!");
            } else {
                alert("✅ Thêm nhân viên thành công!");
            }

            setShowForm(false);

            loadEmployees();
        } catch (error) {
            console.error(error);

            alert(
                "❌ Không thể lưu nhân viên!\n" +
                    error.message
            );
        }
    };

    // =====================================================
    // XEM CHI TIẾT
    // =====================================================

    const openDetail = (employee) => {
        setSelectedEmployee(employee);
        setShowDetail(true);
    };

    // =====================================================
    // KHÓA / MỞ KHÓA
    // =====================================================

    const updateEmployeeStatus = async (
        employee,
        active
    ) => {
        const message = active
            ? `Bạn có chắc muốn MỞ KHÓA nhân viên "${employee.username}"?`
            : `Bạn có chắc muốn KHÓA nhân viên "${employee.username}"?`;

        if (!window.confirm(message)) {
            return;
        }

        try {
            const response = await fetch(
                `/api/employees/${encodeURIComponent(
                    employee.username
                )}/status?active=${active}`,
                {
                    method: "PUT",
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText || "Không thể cập nhật trạng thái"
                );
            }

            alert(
                active
                    ? "🔓 Đã mở khóa nhân viên!"
                    : "🔒 Đã khóa nhân viên!"
            );

            loadEmployees();
        } catch (error) {
            console.error(error);

            alert(
                "❌ Không thể cập nhật trạng thái nhân viên!\n" +
                    error.message
            );
        }
    };

    // =====================================================
    // XÓA NHÂN VIÊN
    // =====================================================

    const deleteEmployee = async (employee) => {
        const confirmDelete = window.confirm(
            `⚠️ Bạn có chắc muốn XÓA nhân viên "${employee.username}" không?\n\nHành động này không thể hoàn tác.`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `/api/employees/${employee.id}`,
            {
                    method: "DELETE",
            }
        );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText || "Xóa nhân viên thất bại"
                );
            }

            alert("🗑️ Xóa nhân viên thành công!");

            setEmployees((prev) =>
                prev.filter(
                    (item) =>
                        item.username !== employee.username
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                "❌ Không thể xóa nhân viên!\n" +
                    error.message
            );
        }
    };

    // =====================================================
    // TÌM KIẾM
    // =====================================================

    const filteredEmployees = employees.filter(
        (employee) => {
            const keyword =
                search.toLowerCase();

            return (
                String(
                    employee.username || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    employee.fullName || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    employee.phone || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    employee.position || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    employee.address || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        }
    );

    // =====================================================
    // GIAO DIỆN
    // =====================================================

    return (
        <div className="admin-employees-page">

            {/* =================================================
                TRỞ VỀ DASHBOARD
            ================================================= */}

            <button
                className="admin-back-home-btn"
                onClick={() => navigate("/admin")}
            >
                ← Trở về trang chủ
            </button>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-employees-header">

                <div>
                    <h1>
                        👨‍💼 Quản lý nhân viên
                    </h1>

                    <p>
                        Quản lý tài khoản nhân viên
                        của cửa hàng
                    </p>
                </div>

                <div className="admin-employees-header-actions">

                    <button
                        className="admin-refresh-btn"
                        onClick={loadEmployees}
                    >
                        🔄 Làm mới
                    </button>

                    <button
                        className="admin-add-employee-btn"
                        onClick={openAddForm}
                    >
                        ➕ Thêm nhân viên
                    </button>

                </div>

            </div>

            {/* =================================================
                THỐNG KÊ
            ================================================= */}

            <div className="admin-employee-stat">

                <div>

                    <span>
                        👨‍💼
                    </span>

                    <div>

                        <small>
                            Tổng nhân viên
                        </small>

                        <strong>
                            {employees.length}
                        </strong>

                    </div>

                </div>

            </div>

            {/* =================================================
                TÌM KIẾM
            ================================================= */}

            <div className="admin-employee-toolbar">

                <div className="admin-employee-search">

                    🔍

                    <input
                        type="text"
                        placeholder="Tìm tên, username, số điện thoại, chức vụ..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </div>

            {/* =================================================
                DANH SÁCH
            ================================================= */}

            <div className="admin-employees-container">

                {loading ? (

                    <div className="admin-employee-empty">
                        Đang tải nhân viên...
                    </div>

                ) : filteredEmployees.length === 0 ? (

                    <div className="admin-employee-empty">

                        <div>
                            👨‍💼
                        </div>

                        <h3>
                            Không có nhân viên
                        </h3>

                        <p>
                            Chưa tìm thấy nhân viên phù hợp.
                        </p>

                    </div>

                ) : (

                    filteredEmployees.map(
                        (employee) => (

                            <div
                                className="admin-employee-card"
                                key={employee.id}
                            >

                                {/* =========================
                                    AVATAR
                                ========================= */}

                                <div className="admin-employee-avatar">
                                    👨‍💼
                                </div>

                                {/* =========================
                                    THÔNG TIN
                                ========================= */}

                                <div className="admin-employee-info">

                                    <h3>
                                        {employee.fullName ||
                                            "Chưa cập nhật tên"}
                                    </h3>

                                    <p>
                                        Username:{" "}
                                        <strong>
                                            {employee.username}
                                        </strong>
                                    </p>

                                    <p>
                                        📞{" "}
                                        {employee.phone ||
                                            "Chưa cập nhật"}
                                    </p>

                                    <p>
                                        💼 Chức vụ:{" "}
                                        <strong>
                                            {employee.position ||
                                                "Chưa cập nhật"}
                                        </strong>
                                    </p>

                                    <p>
                                        📍{" "}
                                        {employee.address ||
                                            "Chưa cập nhật"}
                                    </p>

                                </div>

                                {/* =========================
                                    TRẠNG THÁI
                                ========================= */}

                                <div className="admin-employee-status">

                                    {employee.active !== false ? (

                                        <span className="employee-active">
                                            ● Đang hoạt động
                                        </span>

                                    ) : (

                                        <span className="employee-locked">
                                            ● Đã khóa
                                        </span>

                                    )}

                                </div>

                                {/* =========================
                                    ACTION
                                ========================= */}

                                <div className="admin-employee-actions">

                                    {/* CHI TIẾT */}

                                    <button
                                        className="admin-employee-detail"
                                        onClick={() =>
                                            openDetail(employee)
                                        }
                                    >
                                        👁️ Chi tiết
                                    </button>

                                    {/* SỬA */}

                                    <button
                                        className="admin-employee-edit"
                                        onClick={() =>
                                            openEditForm(employee)
                                        }
                                    >
                                        ✏️ Sửa
                                    </button>

                                    {/* KHÓA / MỞ KHÓA */}

                                    {employee.active !== false ? (

                                        <button
                                            className="admin-employee-lock"
                                            onClick={() =>
                                                updateEmployeeStatus(
                                                    employee,
                                                    false
                                                )
                                            }
                                        >
                                            🔒 Khóa
                                        </button>

                                    ) : (

                                        <button
                                            className="admin-employee-unlock"
                                            onClick={() =>
                                                updateEmployeeStatus(
                                                    employee,
                                                    true
                                                )
                                            }
                                        >
                                            🔓 Mở khóa
                                        </button>

                                    )}

                                    {/* XÓA */}

                                    <button
                                        className="admin-employee-delete"
                                        onClick={() =>
                                            deleteEmployee(employee)
                                        }
                                    >
                                        🗑️ Xóa
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

            {/* =================================================
                MODAL THÊM / SỬA
            ================================================= */}

            {showForm && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setShowForm(false)
                    }
                >

                    <div
                        className="admin-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="admin-modal-header">

                            <h2>
                                {editing
                                    ? "✏️ Sửa nhân viên"
                                    : "➕ Thêm nhân viên"}
                            </h2>

                            <button
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="admin-employee-form"
                        >

                            <label>
                                Username
                            </label>

                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                disabled={editing}
                                placeholder="Nhập username"
                            />

                            <label>
                                Mật khẩu
                                {editing &&
                                    " (bỏ trống nếu không đổi)"}
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                            />

                            <label>
                                Họ và tên
                            </label>

                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ tên"
                            />

                            <label>
                                Số điện thoại
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />

                            <label>
                                Chức vụ
                            </label>

                            <input
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                placeholder="Ví dụ: Nhân viên bán hàng"
                            />

                            <label>
                                Địa chỉ
                            </label>

                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                            />

                            <div className="admin-modal-actions">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Hủy
                                </button>

                                <button type="submit">
                                    {editing
                                        ? "💾 Lưu thay đổi"
                                        : "➕ Thêm nhân viên"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                MODAL CHI TIẾT
            ================================================= */}

            {showDetail &&
                selectedEmployee && (

                    <div
                        className="admin-modal-overlay"
                        onClick={() =>
                            setShowDetail(false)
                        }
                    >

                        <div
                            className="admin-modal admin-detail-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="admin-modal-header">

                                <h2>
                                    👁️ Chi tiết nhân viên
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowDetail(false)
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                            <div className="employee-detail-content">

                                <div className="employee-detail-avatar">
                                    👨‍💼
                                </div>

                                <h2>
                                    {selectedEmployee.fullName ||
                                        "Chưa cập nhật"}
                                </h2>

                                <p>
                                    <strong>
                                        Username:
                                    </strong>{" "}
                                    {selectedEmployee.username}
                                </p>

                                <p>
                                    <strong>
                                        Số điện thoại:
                                    </strong>{" "}
                                    {selectedEmployee.phone ||
                                        "Chưa cập nhật"}
                                </p>

                                <p>
                                    <strong>
                                        Chức vụ:
                                    </strong>{" "}
                                    {selectedEmployee.position ||
                                        "Chưa cập nhật"}
                                </p>

                                <p>
                                    <strong>
                                        Địa chỉ:
                                    </strong>{" "}
                                    {selectedEmployee.address ||
                                        "Chưa cập nhật"}
                                </p>

                                <p>
                                    <strong>
                                        Trạng thái:
                                    </strong>{" "}

                                    {selectedEmployee.active !==
                                    false
                                        ? "🟢 Đang hoạt động"
                                        : "🔴 Đã khóa"}
                                </p>

                            </div>

                            <div className="admin-modal-actions">

                                <button
                                    onClick={() =>
                                        setShowDetail(false)
                                    }
                                >
                                    Đóng
                                </button>

                                <button
                                    onClick={() => {
                                        setShowDetail(false);
                                        openEditForm(
                                            selectedEmployee
                                        );
                                    }}
                                >
                                    ✏️ Sửa nhân viên
                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
}

export default Employees;