import { useState, memo } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi';
import { DashboardRequestApi } from '../../services/api';
import InputField from '../InputField';

function CreateModal({ setIsCreateModal, onPostSuccess, pondTypeName }) { 
    const [pondId, setPondId] = useState(''); // State để lưu giá trị của pondId và pondTypeId
    const [deep, setDeep] = useState(0); // State để lưu giá trị độ sâu (deep)
    const [diameter, setDiameter] = useState(0); // State để lưu giá trị đường kính (diameter)
    const [errorMessage, setErrorMessage] = useState(''); // State lưu lỗi
    const [isLoading, setIsLoading] = useState(false); // State xử lý khi submit
    const callApi = useCallApi(); // Khởi tạo hook useCallApi

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsCreateModal(false);
        }
    };

    // Hàm xử lý khi người dùng nhập dữ liệu vào
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage(''); 
    };

    const farmName = localStorage.getItem('farmName') || '';
    const username = localStorage.getItem('username') || '';

    const handleSubmit = (e) => {
        e.preventDefault();
     
        if (pondId.trim() && deep > 0 && diameter > 0) {
            const data = {
                pondId: pondId.trim(),
                pondTypeName: pondTypeName.trim(),
                deep: parseFloat(deep), 
                diameter: parseFloat(diameter),
                farmName: farmName.trim()
            };
            
            setIsLoading(true); // Hiển thị trạng thái loading
     
            // Sử dụng hook useCallApi theo cách đúng
            callApi(
                () => DashboardRequestApi.pondRequest.createPondRequest(data), // API function
                (res) => { // Resolve function khi thành công
                    setIsLoading(false); // Tắt trạng thái loading
                    onPostSuccess(); // Gọi callback khi POST thành công
                    setIsCreateModal(false); // Đóng Modal
                    setPondId(''); // Reset giá trị input
                    setDeep(0);
                    setDiameter(0);
                },
                'Ao đã được tạo thành công!', // Thông báo thành công
                (err) => { // Reject function khi lỗi
                    setIsLoading(false); // Tắt trạng thái loading khi gặp lỗi
                    setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Hiển thị lỗi
                    console.error('Error:', err);
                }
            );
        } else {
            setErrorMessage('Các trường không được để trống và giá trị phải hợp lệ!'); // Thông báo lỗi nếu có trường nào trống hoặc không hợp lệ
        }
    };

    const handleInputChangeWithValidation = (setter) => (e) => {
        const value = e.target.value;
        
        const regex = /^-?\d*(\.\d*)?$/;
        if (regex.test(value) || value === '') {
            setter(value); // Cập nhật giá trị nếu hợp lệ
            setErrorMessage(''); // Xóa thông báo lỗi
        } else {
            setErrorMessage('Chỉ được nhập số thực!');
        }
    };

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20")} 
            onClick={handleCloseModal} // Thêm sự kiện onClick vào div bao ngoài
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] min-h-[300px] border-2 border-black">
                {/* Nút đóng modal */}
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsCreateModal(false)} // Đóng modal khi nhấn vào nút đóng
                >
                    <IoCloseSharp />
                </i>
                {/* Tiêu đề */}
                <header className="text-xl font-bold text-center uppercase mb-2">Tạo Ao Mới</header>

                {/* Form nhập liệu */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="pondId" className="block text-left font-semibold mb-2">Pond ID:</label>
                        <input 
                            type="text" 
                            id="pondId" 
                            name="pondId" 
                            placeholder="Nhập Pond ID"
                            value={pondId} // Liên kết giá trị với state pondId
                            onChange={handleInputChange(setPondId)} // Gọi hàm khi người dùng nhập liệu
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
                        />
                    </div>
                    
                    <div className="mb-2">

                        <InputField 
                            label = "Độ sâu (m)"
                            type="text" 
                            id="deep"  
                            placeholder="Nhập độ sâu"
                            value={deep} 
                            onChange={handleInputChangeWithValidation(setDeep)}
                        />
                    </div>

                    

                    <div className="mb-2">
                        <InputField 
                            label = "Đường kính (m)"
                            type="text" 
                            id="diameter" 
                            name="diameter" 
                            placeholder="Nhập đường kính"
                            value={diameter} // Liên kết giá trị với state diameter
                            onChange={handleInputChangeWithValidation(setDiameter)} // setDiameter
                            min="0"
                        />
                    </div>

                    {/* Thông báo lỗi */}
                    {errorMessage && (
                        <p className="text-red-600 text-center mb-2">{errorMessage}</p>
                    )}

                    {/* Nút submit */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className={cl("bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md w-40", {
                                'opacity-50 cursor-not-allowed': !pondId || isLoading || deep <= 0 || diameter <= 0 // Disable nếu không có dữ liệu hoặc đang tải
                            })}
                            disabled={!pondId || isLoading || deep <= 0 || diameter <= 0} // Không cho submit nếu không có dữ liệu hợp lệ
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(CreateModal);
