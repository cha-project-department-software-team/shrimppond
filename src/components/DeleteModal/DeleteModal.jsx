import { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi'; // Hook đã có sẵn

function DeleteModal({ isDeleteModal, setIsDeleteModal, onDeleteSuccess }) { 
    const [pondTypeId, setPondTypeId] = useState(''); // Lưu mã khối (pondTypeId)
    const [errorMessage, setErrorMessage] = useState(''); // Lưu thông báo lỗi
    const [isLoading, setIsLoading] = useState(false); // Xử lý trạng thái đang tải
    const callApi = useCallApi();

    if (!isDeleteModal) return null;

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsDeleteModal(false);
        }
    };

    const handleInputChange = (e) => {
        setPondTypeId(e.target.value); // Cập nhật mã khối
        setErrorMessage(''); // Reset lại thông báo lỗi nếu người dùng nhập lại
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pondTypeId.trim()) {
            setIsLoading(true); // Bật trạng thái loading

            callApi(
                () => DashboardRequestApi.pondTypeRequest.deletePondTypeRequest(pondTypeId), // Gọi API để xóa PondType
                (res) => {
                    setIsLoading(false); // Tắt trạng thái loading
                    onDeleteSuccess(); // Gọi callback khi thành công
                    setIsDeleteModal(false); // Đóng Modal
                    setPondTypeId(''); // Reset lại input
                },
                'Khối đã được xóa thành công!', // Thông báo thành công
                (err) => { // Xử lý lỗi
                    setIsLoading(false); // Tắt trạng thái loading
                    setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Hiển thị lỗi
                    console.error('Error:', err);
                }
            );
        } else {
            setErrorMessage('Mã khối không được để trống!'); // Lỗi nếu người dùng không nhập mã
        }
    };

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20")} 
            onClick={handleCloseModal} // Sự kiện click đóng modal
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[400px] min-h-[200px] border-2 border-black">
                {/* Nút đóng modal */}
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsDeleteModal(false)} // Đóng modal khi click nút đóng
                >
                    <IoCloseSharp />
                </i>

                {/* Tiêu đề */}
                <header className="text-xl font-bold text-center uppercase mb-4">Xóa khối</header>

                {/* Form nhập mã khối */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="pondTypeId" className="block text-left font-semibold mb-2">Nhập mã khối:</label>
                        <input 
                            type="text" 
                            id="pondTypeId" 
                            name="pondTypeId" 
                            placeholder="Nhập mã khối"
                            value={pondTypeId} // Liên kết giá trị với state pondTypeId
                            onChange={handleInputChange} // Gọi khi người dùng nhập
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
                        />
                    </div>

                    {/* Hiển thị lỗi */}
                    {errorMessage && (
                        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                    )}

                    {/* Nút xác nhận */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className={cl("bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md w-40", {
                                'opacity-50 cursor-not-allowed': !pondTypeId || isLoading // Disable nếu không có dữ liệu hoặc đang tải
                            })}
                            disabled={!pondTypeId || isLoading} // Không cho submit khi không có dữ liệu
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeleteModal;
