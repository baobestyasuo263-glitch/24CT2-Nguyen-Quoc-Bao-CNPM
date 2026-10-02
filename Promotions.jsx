import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Promotions() {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    code: "",
    name: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderValue: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  // ==========================================
  // LẤY DANH SÁCH KHUYẾN MÃI
  // ==========================================

  const loadPromotions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/promotions"
      );

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách khuyến mãi");
      }

      const data = await response.json();

      setPromotions(data);
    } catch (error) {
      console.error(error);
      alert("❌ Không thể tải dữ liệu khuyến mãi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // ==========================================
  // FORM
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      code: "",
      name: "",
      discountType: "PERCENT",
      discountValue: "",
      minOrderValue: "",
      startDate: "",
      endDate: "",
      active: true,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================
  // THÊM / SỬA
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      alert("⚠️ Vui lòng nhập mã khuyến mãi!");
      return;
    }

    if (!form.name.trim()) {
      alert("⚠️ Vui lòng nhập tên chương trình!");
      return;
    }

    if (!form.discountValue || Number(form.discountValue) <= 0) {
      alert("⚠️ Giá trị giảm phải lớn hơn 0!");
      return;
    }

    if (
      !form.minOrderValue ||
      Number(form.minOrderValue) < 0
    ) {
      alert("⚠️ Đơn tối thiểu không hợp lệ!");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("⚠️ Vui lòng chọn thời gian!");
      return;
    }

    if (
      new Date(form.endDate) <=
      new Date(form.startDate)
    ) {
      alert("⚠️ Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    const promotionData = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue),
      startDate: form.startDate,
      endDate: form.endDate,
      active: true,
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `/api/promotions/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(promotionData),
          }
        );
      } else {
        response = await fetch(
          "/api/promotions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(promotionData),
          }
        );
      }

      if (!response.ok) {
        const message = await response.text();

        alert(
          message ||
            (editingId
              ? "Không thể sửa khuyến mãi!"
              : "Không thể thêm khuyến mãi!")
        );

        return;
      }

      alert(
        editingId
          ? "✅ Sửa khuyến mãi thành công!"
          : "✅ Thêm khuyến mãi thành công!"
      );

      resetForm();

      loadPromotions();
    } catch (error) {
      console.error(error);

      alert("❌ Không thể kết nối đến backend!");
    }
  };

  // ==========================================
  // CHUẨN HÓA NGÀY CHO INPUT
  // ==========================================

  const convertToInputDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    const hours = String(
      d.getHours()
    ).padStart(2, "0");

    const minutes = String(
      d.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // ==========================================
  // MỞ FORM SỬA
  // ==========================================

  const editPromotion = (promotion) => {
    setEditingId(promotion.id);

    setForm({
      code: promotion.code || "",
      name: promotion.name || "",
      discountType:
        promotion.discountType || "PERCENT",
      discountValue:
        promotion.discountValue ?? "",
      minOrderValue:
        promotion.minOrderValue ?? "",
      startDate: convertToInputDate(
        promotion.startDate
      ),
      endDate: convertToInputDate(
        promotion.endDate
      ),
      active:
        promotion.active !== false,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // BẬT / TẮT
  // ==========================================

  const togglePromotion = async (
    id,
    active
  ) => {
    try {
      const response = await fetch(
        `/api/promotions/${id}/status?active=${!active}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const message = await response.text();

        alert(
          message ||
            "Không thể cập nhật trạng thái!"
        );

        return;
      }

      loadPromotions();
    } catch (error) {
      console.error(error);

      alert(
        "❌ Không thể kết nối đến backend!"
      );
    }
  };

  // ==========================================
  // XÓA
  // ==========================================

  const deletePromotion = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Bạn có chắc muốn xóa khuyến mãi này không?\n\nHành động này không thể hoàn tác."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/promotions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text();

        alert(
          message ||
            "Không thể xóa khuyến mãi!"
        );

        return;
      }

      alert("🗑️ Xóa khuyến mãi thành công!");

      loadPromotions();
    } catch (error) {
      console.error(error);

      alert(
        "❌ Không thể kết nối đến backend!"
      );
    }
  };

  // ==========================================
  // FORMAT
  // ==========================================

  const formatMoney = (value) => {
    return (
      Number(value || 0).toLocaleString(
        "vi-VN"
      ) + "đ"
    );
  };

  const formatDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleString(
      "vi-VN"
    );
  };

  const formatDiscount = (promotion) => {
    if (
      promotion.discountType ===
      "PERCENT"
    ) {
      return `${promotion.discountValue}%`;
    }

    return formatMoney(
      promotion.discountValue
    );
  };

  // ==========================================
  // TÌM KIẾM
  // ==========================================

  const filteredPromotions =
    promotions.filter((promotion) => {
      const keyword =
        search.toLowerCase();

      return (
        promotion.code
          ?.toLowerCase()
          .includes(keyword) ||
        promotion.name
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  // ==========================================
  // GIAO DIỆN
  // ==========================================

  return (
    <div className="promotion-page">

      {/* TRỞ VỀ ADMIN */}

      <button
        className="admin-back-home-btn"
        onClick={() =>
          navigate("/admin")
        }
      >
        ← Trở về trang chủ
      </button>


      {/* HEADER */}

      <div className="promotion-title">

        <div>

          <h1>
            🎁 Quản lý khuyến mãi
          </h1>

          <p>
            Quản lý mã giảm giá và chương trình
            ưu đãi của SHOPWEB
          </p>

        </div>


        <button
          className="promotion-add-btn"
          onClick={() => {
            setEditingId(null);

            setForm({
              code: "",
              name: "",
              discountType: "PERCENT",
              discountValue: "",
              minOrderValue: "",
              startDate: "",
              endDate: "",
              active: true,
            });

            setShowForm(true);
          }}
        >
          + Thêm khuyến mãi
        </button>

      </div>


      {/* FORM */}

      {showForm && (

        <div className="promotion-form">

          <div className="promotion-form-header">

            <h2>
              {editingId
                ? "✏️ Sửa khuyến mãi"
                : "➕ Thêm khuyến mãi"}
            </h2>

            <button
              type="button"
              className="promotion-close-btn"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
          >

            <div className="promotion-form-grid">

              <div className="promotion-form-group">

                <label>
                  Mã khuyến mãi
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="Ví dụ: SALE30"
                  value={form.code}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="promotion-form-group">

                <label>
                  Tên chương trình
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Ví dụ: Giảm 30%"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="promotion-form-group">

                <label>
                  Loại giảm giá
                </label>

                <select
                  name="discountType"
                  value={
                    form.discountType
                  }
                  onChange={handleChange}
                >

                  <option value="PERCENT">
                    Phần trăm (%)
                  </option>

                  <option value="FIXED">
                    Số tiền cố định
                  </option>

                </select>

              </div>


              <div className="promotion-form-group">

                <label>
                  Giá trị giảm
                </label>

                <input
                  type="number"
                  name="discountValue"
                  placeholder={
                    form.discountType ===
                    "PERCENT"
                      ? "Ví dụ: 10"
                      : "Ví dụ: 50000"
                  }
                  value={
                    form.discountValue
                  }
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="promotion-form-group">

                <label>
                  Đơn tối thiểu
                </label>

                <input
                  type="number"
                  name="minOrderValue"
                  placeholder="Ví dụ: 500000"
                  value={
                    form.minOrderValue
                  }
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="promotion-form-group">

                <label>
                  Ngày bắt đầu
                </label>

                <input
                  type="datetime-local"
                  name="startDate"
                  value={
                    form.startDate
                  }
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="promotion-form-group">

                <label>
                  Ngày kết thúc
                </label>

                <input
                  type="datetime-local"
                  name="endDate"
                  value={
                    form.endDate
                  }
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="promotion-form-actions">

              <button
                type="submit"
                className="promotion-save-btn"
              >
                💾{" "}
                {editingId
                  ? "Lưu thay đổi"
                  : "Lưu khuyến mãi"}
              </button>


              <button
                type="button"
                className="promotion-cancel-btn"
                onClick={resetForm}
              >
                Hủy
              </button>

            </div>

          </form>

        </div>

      )}


      {/* DANH SÁCH */}

      <div className="promotion-container">

        <div className="promotion-list-header">

          <div>

            <h2>
              🎟️ Danh sách khuyến mãi
            </h2>

            <span>
              Tổng: {promotions.length} chương trình
            </span>

          </div>


          <input
            className="promotion-search"
            type="text"
            placeholder="🔍 Tìm mã hoặc tên..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {loading ? (

          <div className="promotion-loading">
            Đang tải dữ liệu...
          </div>

        ) : filteredPromotions.length === 0 ? (

          <div className="promotion-empty">
            Không tìm thấy khuyến mãi.
          </div>

        ) : (

          <div className="promotion-table-wrapper">

            <table className="promotion-table">

              <thead>

                <tr>

                  <th>Mã</th>

                  <th>Tên chương trình</th>

                  <th>Giảm giá</th>

                  <th>Đơn tối thiểu</th>

                  <th>Thời gian</th>

                  <th>Trạng thái</th>

                  <th>Thao tác</th>

                </tr>

              </thead>


              <tbody>

                {filteredPromotions.map(
                  (promotion) => (

                    <tr
                      key={promotion.id}
                    >

                      <td>

                        <strong className="promotion-code">
                          {promotion.code}
                        </strong>

                      </td>


                      <td>

                        <strong>
                          {promotion.name}
                        </strong>

                      </td>


                      <td>

                        <span className="discount-value">
                          {formatDiscount(
                            promotion
                          )}
                        </span>

                        <div className="discount-type">
                          {promotion.discountType ===
                          "PERCENT"
                            ? "Phần trăm"
                            : "Giảm tiền"}
                        </div>

                      </td>


                      <td>
                        {formatMoney(
                          promotion.minOrderValue
                        )}
                      </td>


                      <td>

                        <div>
                          {formatDate(
                            promotion.startDate
                          )}
                        </div>

                        <div className="date-end">
                          đến
                        </div>

                        <div>
                          {formatDate(
                            promotion.endDate
                          )}
                        </div>

                      </td>


                      <td>

                        {promotion.active ? (

                          <span className="promotion-active">
                            ● Đang hoạt động
                          </span>

                        ) : (

                          <span className="promotion-inactive">
                            ● Đã tắt
                          </span>

                        )}

                      </td>


                      <td>

                        <div className="promotion-actions">

                          <button
                            className="promotion-edit-btn"
                            onClick={() =>
                              editPromotion(
                                promotion
                              )
                            }
                          >
                            ✏️ Sửa
                          </button>


                          <button
                            className="promotion-toggle-btn"
                            onClick={() =>
                              togglePromotion(
                                promotion.id,
                                promotion.active
                              )
                            }
                          >
                            {promotion.active
                              ? "🔴 Tắt"
                              : "🟢 Bật"}
                          </button>


                          <button
                            className="promotion-delete-btn"
                            onClick={() =>
                              deletePromotion(
                                promotion.id
                              )
                            }
                          >
                            🗑️ Xóa
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Promotions;