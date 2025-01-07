import { useState, memo } from "react";
import { IoCloseSharp } from "react-icons/io5";
import cl from "classnames";
import useCallApi from "../../hooks/useCallApi";
import { DashboardRequestApi } from "../../services/api";

function Account({ setIsAccountModal, onLoginSuccess }) {
    const [username, setUsername] = useState(""); // State lưu tài khoản
    const [password, setPassword] = useState(""); // State lưu mật khẩu
    const [errorMessage, setErrorMessage] = useState(""); // Lưu lỗi
    const [isLoading, setIsLoading] = useState(false); // Xử lý trạng thái đang tải
    const callApi = useCallApi(); // Hook gọi API

    // Đóng modal khi click ra ngoài
    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsAccountModal(false);
        }
    };

    // Xử lý khi người dùng nhập
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
        setErrorMessage(""); // Xóa lỗi khi người dùng nhập
    };

    // Gửi form đăng nhập
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setErrorMessage("Tài khoản và mật khẩu không được để trống!");
            return;
        }

        const data = {
            username: username.trim(),
            password: password.trim(),
        };

        setIsLoading(true);

        // Gọi API đăng nhập
        callApi(
            () => DashboardRequestApi.authRequest.login(data), // Hàm gọi API
            (res) => {
                setIsLoading(false);
                if (res.token) {
                    // Lưu token vào localStorage
                    localStorage.setItem("token", res.token);
                    onLoginSuccess(); // Gọi callback khi đăng nhập thành công
                    setIsAccountModal(false); // Đóng modal
                } else {
                    setErrorMessage("Phản hồi từ server không hợp lệ!");
                }
            },
            null, // Bỏ phần hiển thị toast thành công
            (err) => {
                setIsLoading(false);
                setErrorMessage(
                    err?.message || "Đã có lỗi xảy ra, vui lòng thử lại!"
                );
            }
        );
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20"
            onClick={handleCloseModal}
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[400px] min-h-[400px] border-2 border-black">
                {/* Nút đóng */}
                <i
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsAccountModal(false)}
                >
                    <IoCloseSharp />
                </i>

                {/* Tiêu đề */}
                <header className="text-xl font-bold text-center uppercase mb-4">
                    Đăng nhập
                </header>

                {/* Form đăng nhập */}
                <form onSubmit={handleSubmit}>
                    {/* Tài khoản */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-left font-semibold mb-2"
                        >
                            Tài khoản:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Nhập tài khoản"
                            value={username}
                            onChange={(e) => handleInputChange(e, setUsername)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-left font-semibold mb-2"
                        >
                            Mật khẩu:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => handleInputChange(e, setPassword)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Hiển thị lỗi */}
                    {errorMessage && (
                        <p className="text-red-600 text-center mb-4">
                            {errorMessage}
                        </p>
                    )}

                    {/* Nút đăng nhập */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={cl(
                                "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md w-40",
                                {
                                    "opacity-50 cursor-not-allowed":
                                        !username || !password || isLoading,
                                }
                            )}
                            disabled={!username || !password || isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(Account);
