import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../../components/Register";
import useCallApi from "../../hooks/useCallApi"; // Hook gọi API
import { DashboardRequestApi } from "../../services/api"; // Dịch vụ API

function Account() {
  const navigate = useNavigate();
  const callApi = useCallApi(); // Hook API
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoginEnabled = username.trim() !== "" && password.trim() !== "";

  // Hàm đăng nhập
  const handleLogin = useCallback(() => {
    if (!isLoginEnabled) return;

    setIsLoading(true);

    const loginData = {
      username: username.trim(),
      password: password.trim(),
    };

    // Gọi API thông qua hook callApi
    callApi(
      [DashboardRequestApi.authRequest.login(loginData)], // Gửi request login
      (res) => {
        console.log(">>> Response từ API:", res);

        if (res && res[0] && res[0].token) {
          // Lưu token và username vào localStorage
          localStorage.setItem("token", res[0].token);
          localStorage.setItem("username", loginData.username);

          // Chuyển hướng sang dashboard
          navigate("/");
        } else {
          alert("Phản hồi từ server không hợp lệ!"); // Thông báo lỗi đơn giản
        }
        setIsLoading(false); // Thoát trạng thái loading
      },
      (error) => {
        // Xử lý lỗi
        if (error.response?.status === 401) {
          alert("Sai tên đăng nhập hoặc mật khẩu!");
        } else {
          alert("Có lỗi xảy ra. Vui lòng thử lại sau!");
        }
        setIsLoading(false); // Thoát trạng thái loading khi thất bại
      }
    );
  }, [callApi, username, password, isLoginEnabled, navigate]);

  // Hàm được gọi khi đăng ký thành công
  const handleRegisterSuccess = () => {
    alert("Tài khoản đã được tạo thành công!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Log in</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={!isLoginEnabled || isLoading}
          className={`w-full py-2 text-white font-semibold rounded-md ${
            isLoginEnabled
              ? "bg-red-500 hover:bg-red-600 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Đang xử lý..." : "Login"}
        </button>
        <div
          onClick={() => setIsRegisterOpen(true)}
          className="mt-4 text-sm text-blue-500 hover:text-blue-700 cursor-pointer text-center font-semibold"
        >
          Đăng ký tài khoản
        </div>
      </div>

      {/* Component Register */}
      {isRegisterOpen && (
        <Register
          setIsRegister={setIsRegisterOpen}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}

export default Account;
