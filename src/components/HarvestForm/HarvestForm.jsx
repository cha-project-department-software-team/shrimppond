import { useState, useRef, useCallback, useEffect } from 'react';
import { IoCalendar, IoDocument } from 'react-icons/io5';
import useCallApi from '../../hooks/useCallApi';
import cl from 'classnames';
import { DashboardRequestApi, HarvestRequest } from '../../services/api';
import InputField from '../InputField';
import SelectField from '../SelectField';
import { useLocation } from 'react-router-dom';

function HarvestForm() {
    const [pondId, setPondId] = useState('');
    const [harvestType, setHarvestType] = useState(0); // Harvest type (default 0)
    const [harvestDate, setHarvestDate] = useState(''); // ISO format date
    const [size, setSize] = useState(0); // Size of shrimp
    const [harvestTime, setHarvestTime] = useState(0); // Harvest time
    const [amount, setAmount] = useState(0); // Amount (biomass)
    const [certificates, setCertificates] = useState([]); // Array of certificate strings
    const [ponds, setPonds] = useState([]); // State to store pond list
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dateInputRef = useRef(null); // Reference to the date input

    const callApi = useCallApi();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.pondId) {
            setPondId(location.state.pondId);
            fetchData();
        }
    }, [location.state]);

    const harvestData = useCallback(() => {
        if (!pondId || pondId === '') return; // Skip if pondId is empty

        callApi(
            [
                HarvestRequest.HarvestRequestApi.getHarvestTime(pondId),  // Get harvest time by pondId
            ],
            (res) => {
                setHarvestTime(res[0].harvestTime + 1); // Set harvest time
            },
            'Failed to get pond list and harvest time!'  // Error message
        );
    }, [callApi, pondId]);

    useEffect(() => {
        harvestData();
    }, [harvestData, pondId]); // Re-fetch when pondId changes

    const fetchData = useCallback(() => {
        callApi(
            [
                DashboardRequestApi.pondRequest.getPondRequestByStatus(1),  // Get ponds list
            ],
            (res) => {
                setPonds(res[0]); // Save ponds data
            },
            'Failed to get pond list!'  // Error message
        );
    }, [callApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Re-fetch when component mounts    

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Remove data URL prefix
                setCertificates([base64String]); // Store base64 string
            };
            reader.readAsDataURL(file); // Convert file to base64
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!pondId || !harvestDate || amount <= 0 || size <= 0) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin và đảm bảo giá trị hợp lệ!');
            return;
        }

        const data = {
            harvestType,
            harvestDate: new Date(harvestDate).toISOString(), // Convert date to ISO format
            amount,
            size,
            certificates,
            pondId,
        };

        console.log(data)

        setIsLoading(true);
        callApi(
            () => HarvestRequest.HarvestRequestApi.postHarvest(data), // POST data
            (res) => {
                setIsLoading(false);
                setErrorMessage(''); // Clear error message on success
            },
            'Thu hoạch đã được tạo thành công!', // Success message
            (err) => {
                setIsLoading(false);
                setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Display error
            }
        );
    };

    const handleCalendarClick = () => {
        dateInputRef.current.focus(); // Focus on date input
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <form onSubmit={handleSubmit}>
                {/* Select pond */}
                <div className="flex justify-center mb-4">
                    <SelectField
                        label="Chọn ao"
                        id="pondId"
                        value={pondId}
                        onChange={handleInputChange(setPondId)}  // Update pondId
                        options={[
                            { value: '', label: 'Chọn ao' },  // Default value
                            ...ponds.map((pond) => ({ value: pond.pondId, label: pond.pondId }))
                        ]}
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
                        options={[
                            { value: '', label: 'Chọn loại thu hoạch' },
                            { value: 0, label: 'Thu tỉa' },
                            { value: 1, label: 'Thu toàn bộ' }
                        ]}
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
                        <label htmlFor="certificates" className="block text-gray-700">
                            Giấy xét nghiệm kháng sinh:
                        </label>
                        <div className="flex items-center">
                            <input
                                type="file"
                                id="certificates"
                                multiple
                                onChange={handleFileChange} // Handle file change
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
                        label="Size tôm (cm)"
                        id="size"
                        type="number"
                        value={size}
                        onChange={handleInputChange(setSize)}
                        placeholder="Nhập kích cỡ tôm"
                    />
                    <InputField
                        label="Sinh khối lúc thu hoạch"
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={handleInputChange(setAmount)}
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
                        className={cl('bg-green-500 hover:bg-green-600 text-xl font-medium text-black py-2 px-6 rounded-md w-1/4', {
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
