import { useState, useRef, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import { FaTrashAlt } from 'react-icons/fa';

function SetTime({ setIsSetTime, onPostSuccess }) { 
    const [timeFields, setTimeFields] = useState([{ hour: "", minute: "" }]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState({});

    const dropdownRefs = useRef([]); // Mảng refs cho từng dropdown

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsSetTime(false);
        }
    };

    const handleAddTimeField = () => {
        setTimeFields([...timeFields, { hour: "", minute: "" }]);
    };

    const handleRemoveTimeField = (index) => {
        const newTimeFields = timeFields.filter((_, i) => i !== index);
        setTimeFields(newTimeFields);
    };

    const toggleDropdown = (index, field) => {
        setDropdownVisible({ index, field });
    };

    const handleTimeChange = (index, field, value) => {
        const newTimeFields = [...timeFields];
        newTimeFields[index][field] = value;
        setTimeFields(newTimeFields);
        setDropdownVisible({}); // Đóng dropdown khi chọn giá trị
    };

    const hourOptions = Array.from({ length: 25 }, (_, i) => i.toString());
    const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (timeFields.every(({ hour, minute }) => hour !== "" && minute !== "")) {
            const data = {
                timeSettingObjects: timeFields.map((time, index) => ({
                    index: index,
                    time: `${time.hour}:${time.minute}:00`
                }))
            };
            setIsLoading(true);
            console.log(data); // Dữ liệu sẽ được gửi lên API

            // Đoạn code gọi API có thể được đặt ở đây
            setIsLoading(false);
            onPostSuccess();
            setIsSetTime(false);
            setTimeFields([{ hour: "", minute: "" }]);
        } else {
            setErrorMessage('Cả hai thời gian không được để trống!');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isScrollbarClick = event.target.classList.contains('overflow-y-auto');
            // Đóng dropdown khi nhấp ngoài vùng dropdown
            if (!isScrollbarClick && !dropdownRefs.current.some(ref => ref && ref.contains(event.target))) {
                setDropdownVisible({});
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-50")} 
            onClick={handleCloseModal}
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] min-h-[200px] border-2 border-black">
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsSetTime(false)}
                >
                    <IoCloseSharp />
                </i>
                <header className="text-xl font-bold text-center uppercase mb-4">Thiết Lập Thời Gian</header>

                <form onSubmit={handleSubmit}
                    className ="max-h-[500px] overflow-y-auto"
                >
                    {timeFields.map((time, index) => (
                        <div className="flex mb-4 items-center space-x-2" key={index}>
                            <h2 className='font-semibold'>Thiết lập lần đo {index + 1}</h2>
                            
                            {/* Hour Dropdown */}
                            <div className="relative flex-1" ref={(el) => (dropdownRefs.current[index] = { ...dropdownRefs.current[index], hour: el })}>
                                <input 
                                    type="text"
                                    placeholder="Chọn giờ"
                                    value={time.hour}
                                    onClick={() => toggleDropdown(index, 'hour')}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                                {dropdownVisible.index === index && dropdownVisible.field === 'hour' && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto w-full">
                                        {hourOptions.map((hour) => (
                                            <div 
                                                key={hour}
                                                onClick={() => handleTimeChange(index, 'hour', hour)}
                                                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-green-100 transition-colors duration-150"
                                            >
                                                {hour}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Minute Dropdown */}
                            <div className="relative flex-1" ref={(el) => (dropdownRefs.current[index] = { ...dropdownRefs.current[index], minute: el })}>
                                <input 
                                    type="text"
                                    placeholder="Chọn phút"
                                    value={time.minute}
                                    onClick={() => toggleDropdown(index, 'minute')}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                                {dropdownVisible.index === index && dropdownVisible.field === 'minute' && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto w-full">
                                        {minuteOptions.map((minute) => (
                                            <div 
                                                key={minute}
                                                onClick={() => handleTimeChange(index, 'minute', minute)}
                                                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-green-100 transition-colors duration-150"
                                            >
                                                {minute}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <FaTrashAlt
                                className="text-red-500 font-bold ml-2" 
                                onClick={() => handleRemoveTimeField(index)}
                            >
                                Xóa
                            </FaTrashAlt>
                        </div>
                    ))}

                    {errorMessage && (
                        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                    )}

                    <div className="flex justify-center space-x-4">
                        <button 
                            type="button"
                            className="bg-blue-300 hover:bg-blue-400 text-black py-2 px-4 rounded-md shadow-md"
                            onClick={handleAddTimeField}
                        >
                            Thêm Thời Gian Đo
                        </button>
                        <button 
                            type="submit" 
                            className={cl("bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md", {
                                'opacity-50 cursor-not-allowed': isLoading
                            })}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SetTime;
