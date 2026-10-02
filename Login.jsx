import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    if (!username || !password) {

      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");

      return;
    }


    try {

      setLoading(true);


      const response = await fetch(
        "/api/employees/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username: username,
            password: password
          })
        }
      );


      const data = await response.json();

      localStorage.setItem("employeeLogin", "true");
      localStorage.setItem("employeeUsername", data.username);
      localStorage.setItem("employeeFullName", data.fullName);


      if (!response.ok) {

        alert(
          typeof data === "string"
            ? data
            : "Sai tài khoản hoặc mật khẩu!"
        );

        return;
      }


      // Lưu thông tin nhân viên đăng nhập
      localStorage.setItem(
        "employeeLogin",
        "true"
      );

      localStorage.setItem(
        "employee",
        JSON.stringify(data)
      );


      // Chuyển sang trang nhân viên
      navigate("/employee");


    } catch (error) {

      console.error(error);

      alert(
        "❌ Không thể kết nối với server!"
      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <div
        style={{
          width: "400px",
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#ee4d2d"
          }}
        >
          🛒 SHOPWEB
        </h1>


        <h2
          style={{
            textAlign: "center"
          }}
        >
          Đăng nhập nhân viên
        </h2>


        <form onSubmit={handleLogin}>

          <label>
            Tài khoản
          </label>


          <input
            type="text"
            placeholder="Nhập tài khoản"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              boxSizing: "border-box"
            }}
          />


          <label>
            Mật khẩu
          </label>


          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              boxSizing: "border-box"
            }}
          />


          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#ee4d2d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            {loading
              ? "ĐANG ĐĂNG NHẬP..."
              : "ĐĂNG NHẬP"}
          </button>

        </form>


        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#777"
          }}
        >
          🔐 Đăng nhập bằng tài khoản
          <br />
          nhân viên được cấp bởi quản lý.
        </p>

      </div>

    </div>
  );
}

export default EmployeeLogin;