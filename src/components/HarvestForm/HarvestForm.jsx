import { useState, useRef, useCallback, useEffect } from 'react';
import { IoCalendar, IoDocument } from "react-icons/io5";
import useCallApi from '../../hooks/useCallApi';
import cl from 'classnames';
import { DashboardRequestApi } from '../../services/api';
import InputField from '../InputField';
import SelectField from '../SelectField';

function HarvestForm() {
    const [pondId, setPondId] = useState('');
    const [harvestTime, setHarvestTime] = useState(3); // Example default value
    const [harvestType, setHarvestType] = useState('');
    const [harvestDate, setHarvestDate] = useState(''); // ISO format date
    const [shrimpSize, setShrimpSize] = useState('');
    const [antibioticCert, setAntibioticCert] = useState(null);
    const [ponds, setPonds] = useState([]); // State để lưu danh sách pondTypes
    const [biomass, setBiomass] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dateInputRef = useRef(null); // Reference to the date input

    const callApi = useCallApi()

    const fetchData = useCallback(() => {
        callApi(
          [
            DashboardRequestApi.pondRequest.getPondRequest(),
          ], 
          (res) => {
            setPonds(res[0]); // Lưu dữ liệu vào state ponds
          },
          "Lấy danh sách khối ao thất bại!"
        );
      }, [callApi]);
    
      // Gọi hàm fetchData khi component được mount
      useEffect(() => {
        fetchData();
      }, [fetchData]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (1) { //điều kiện mọi dữ liệu phải nhập đủ
            const data = {
                
            };
            
            setIsLoading(true); // Hiển thị trạng thái loading
     
            // Sử dụng hook useCallApi theo cách đúng
            callApi(
                () => DashboardRequestApi.pondRequest.createPondRequest(data),
                (res) => { // Resolve function khi thành công
                    
                },
                'Ao đã được tạo thành công!', // Thông báo thành công
                (err) => { // Reject function khi lỗi
                    setIsLoading(false); // Tắt trạng thái loading khi gặp lỗi
                    setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Hiển thị lỗi
                }
            );
        } else {
            setErrorMessage('Các trường không được để trống và giá trị phải hợp lệ!'); // Thông báo lỗi nếu có trường nào trống hoặc không hợp lệ
        }

    };

    const handleCalendarClick = () => {
        dateInputRef.current.focus(); // Focusing là đủ
    };
    

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <form onSubmit={handleSubmit}>
                
                        <div className="flex justify-center mb-4">
                        <SelectField
                            label="Chọn ao"
                            id="pondId"
                            value={pondId}
                            onChange={handleInputChange(setPondId)}
                            options={ponds.map((pond) => ({ value: pond.pondId, label: pond.pondId }))}
                        />

                        </div>

                {/* Harvest number and type */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputField
                        label="Lần thu hoạch"
                        id="harvestTime"
                        value={harvestTime}
                        onChange={handleInputChange(setHarvestTime)}
                        placeholder="Nhập lần thu hoạch"
                    />
                    <SelectField
                        label="Loại thu hoạch"
                        id="harvestType"
                        value={harvestType}
                        onChange={handleInputChange(setHarvestType)}
                        options={[{ value: '', label: 'Chọn loại thu hoạch' }, { value: 0, label: 'Thu tỉa' }, { value: 1, label: 'Thu toàn bộ' }]}
                    />
                </div>

                {/* Harvest Date and Antibiotic Certificate */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                        <label htmlFor="harvestDate" className="block text-gray-700">
                            Ngày thu hoạch:
                        </label>
                        <div className="flex items-center">
                            <span
                                className="absolute right-0 pr-3 text-2xl flex items-center text-gray-500 cursor-pointer"
                                onClick={handleCalendarClick} // Click event on calendar icon
                            >
                                <IoCalendar />
                            </span>
                            <input
                                type="date" // Use date input
                                id="harvestDate"
                                ref={dateInputRef} // Reference to the date input
                                value={harvestDate}
                                onChange={handleInputChange(setHarvestDate)}
                                className="block w-full pl-3 text-xl pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <label htmlFor="antibioticCert" className="block text-gray-700">
                            Giấy xét nghiệm kháng sinh:
                        </label>
                        <div className="flex items-center">
                            <input
                                type="file"
                                id="antibioticCert"
                                onChange={(e) => setAntibioticCert(e.target.files[0])}
                                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                            <span className="absolute text-2xl pr-3 right-0 flex items-center justify-items-center text-gray-400">
                                <IoDocument />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shrimp size and Biomass */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputField
                        label="Size tôm (Kg)"
                        id="shrimpSize"
                        value={shrimpSize}
                        onChange={handleInputChange(setShrimpSize)}
                        placeholder="Nhập kích cỡ tôm"
                    />
                    <InputField
                        label="Sinh khối lúc thu hoạch"
                        id="biomass"
                        type ="number"
                        value={biomass}
                        onChange={handleInputChange(setBiomass)}
                        placeholder="Nhập sinh khối thu hoạch"
                    />
                </div>

                {/* Error message */}
                {errorMessage && (
                    <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                )}

                {/* Submit button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className={cl("bg-green-500 hover:bg-green-600 text-xl font-medium text-black py-2 px-6 rounded-md w-1/4", {
                            'opacity-50 cursor-not-allowed': isLoading
                        })}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HarvestForm;
