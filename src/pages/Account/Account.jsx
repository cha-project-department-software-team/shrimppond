import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../../components/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardRequestApi } from "../../services/api"; // API service của bạn
import useCallApi from "../../hooks/useCallApi"; // Hook nếu bạn cần thêm

function Account() {
  const navigate = useNavigate();
  const callApi = useCallApi(); // Nếu bạn cần
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoginEnabled = username.trim() !== "" && password.trim() !== "";

  // Hàm được gọi khi đăng ký thành công
  const handleRegisterSuccess = () => {
    toast.success("Tài khoản đã được tạo thành công!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (!isLoginEnabled) return;

    setIsLoading(true); // Bật trạng thái loading
    const loginData = {
      username: username.trim(),
      password: password.trim(),
    };

    try {
      // Gọi API đăng nhập
      const response = await DashboardRequestApi.authRequest.login(loginData);

      // Kiểm tra phản hồi từ server
      if (response && response.data && response.data.token) {
        const { token } = response.data;

        // Lưu token và username vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        // Thông báo thành công
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Chuyển hướng sang trang dashboard
        navigate("/dashboard");
      } else {
        toast.error("Phản hồi từ server không hợp lệ!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);

      // Hiển thị thông báo lỗi cụ thể
      if (error.response?.status === 401) {
        toast.error("Sai tên đăng nhập hoặc mật khẩu!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
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
          disabled={!isLoginEnabled || isLoading} // Vô hiệu hoá nếu thiếu thông tin hoặc đang xử lý
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
          onRegisterSuccess={handleRegisterSuccess} // Truyền callback
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default Account;
