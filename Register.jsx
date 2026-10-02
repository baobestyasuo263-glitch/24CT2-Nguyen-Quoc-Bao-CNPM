import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !name || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const customer = {
      username: username,
      password: password,
      fullName: name,
      phone: phone,
      address: address
    };

    try {
      const response = await fetch(
        "/api/customers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(customer)
        }
      );

      const data = await response.text();

      if (response.ok) {
        alert("Đăng ký thành công!");

        setUsername("");
        setPassword("");
        setName("");
        setPhone("");
        setAddress("");

        navigate("/login");
      } else {
        alert(data);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Không thể kết nối đến Server! Hãy kiểm tra Spring Boot có đang chạy không."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h1>SHOPWEB</h1>

        <h2>Đăng ký tài khoản</h2>

        <form onSubmit={handleRegister}>

          <label>Họ và tên</label>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Địa chỉ</label>
          <input
            type="text"
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label>Tên đăng nhập</label>
          <input
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="main-btn">
            Đăng ký
          </button>

        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "#ee4d2d" }}>
            Đăng nhập
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;