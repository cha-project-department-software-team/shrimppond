import { useCallback, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi'; // Import hook useCallApi

function Modal({ isModal, setIsModal }) { 
    const [blockName, setBlockName] = useState(''); // State để lưu giá trị của ô input
    const callApi = useCallApi(); // Khởi tạo hook useCallApi

    if (!isModal) return null; // Không render Modal nếu isModal là false

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsModal(false);
        }
    };

    const handleInputChange = (e) => {
        setBlockName(e.target.value); // Cập nhật state blockName với giá trị mới
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi submit mặc định

        // Cấu hình data cho request
        const data = { name: blockName };

        // const fetchData = useCallback(() => {
        //     callApi(
        //         [
        //             'http://shrimppond.runasp.net/api/PondType'
        //         ],
        //     )
        // }, [callApi])
        
    };

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20")} 
            onClick={handleCloseModal} // Thêm sự kiện onClick vào div bao ngoài
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] min-h-[160px] border-2 border-black">
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400"
                    onClick={() => setIsModal(false)} // Đóng modal khi nhấn vào nút đóng
                >
                    <IoCloseSharp />
                </i>
                <header className="text-xl font-bold text-center uppercase">TẠO KHỐI AO</header>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="blockName" className="block text-left font-semibold mb-2">Tên khối:</label>
                        <input 
                            type="text" 
                            id="blockName" 
                            name="blockName" 
                            placeholder="Nhập tên khối"
                            value={blockName} // Liên kết giá trị của ô input với state blockName
                            onChange={handleInputChange} // Gọi hàm handleInputChange khi người dùng nhập liệu
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button 
                            type="submit" 
                            className="bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md w-40">
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal;
