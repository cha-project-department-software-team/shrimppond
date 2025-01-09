import React, { useState, memo, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi';
import { DashboardRequestApi } from '../../services/api';
import InputField from '../InputField';
import FileInputField from '../FileInputField';
import SelectField from '../SelectField'; // Import SelectField


function ActiveCard({ pondId, setIsActiveModal, onDeleteCardSuccess }) {
    const [seedId, setSeedId] = useState('');
    const [seedName, setSeedName] = useState('');
    const [originPondId, setOriginPondId] = useState(''); // For SelectField
    const [certificates, setCertificates] = useState([]);
    const [sizeShrimp, setSizeShrimp] = useState(0);
    const [amountShrimp, setAmountShrimp] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pondOptions, setPondOptions] = useState([]); // Options for SelectField
    const callApi = useCallApi();

    useEffect(() => {
        callApi(
            [
                DashboardRequestApi.pondRequest.getPondRequest(), // Fetch pond data
            ],
            (res) => {
                const ponds = res[0]; // Assuming res[0] contains the pond list
                const filteredOptions = ponds
                    .filter((pond) => pond.pondId !== pondId) // Exclude the current pondId
                    .map((pond) => ({
                        value: pond.pondId,
                        label: pond.pondId,
                    }));
                setPondOptions(filteredOptions); // Set the filtered options
            },
            (err) => {
                console.error("Failed to fetch ponds:", err);
            }
        );
    }, [callApi, pondId]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (seedId && seedName && sizeShrimp > 0 && amountShrimp > 0) {
            const data = {
                pondId,
                seedId: seedId.trim(),
                seedName: seedName.trim(),
                originPondId: originPondId || '', // Optional
                certificates,
                sizeShrimp: parseFloat(sizeShrimp),
                amountShrimp: parseFloat(amountShrimp)
            };

            setIsLoading(true);

            callApi(
                [
                    DashboardRequestApi.pondRequest.updatePondRequest(data),
                ],
                (res) => {
                    setIsLoading(false);
                    onDeleteCardSuccess();
                    setIsActiveModal(false);
                },
                'Cập nhật thành công!',
                (err) => {
                    setIsLoading(false);
                    setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
                    console.error('Error:', err);
                }
            );
        } else {
            setErrorMessage('Các trường không được để trống và giá trị phải hợp lệ!');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setCertificates([base64String]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChangeWithValidation = (setter) => (e) => {
        const value = e.target.value;

        // Chỉ cho phép số thực (có dấu . hoặc , hoặc số âm)
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
            onClick={(e) => e.target === e.currentTarget && setIsActiveModal(false)}
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] min-h-[400px] border-2 border-black">
                <i
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsActiveModal(false)}
                >
                    <IoCloseSharp />
                </i>

                <header className="text-xl font-bold text-center uppercase mb-4">Kích hoạt Ao</header>

                <form onSubmit={handleSubmit}>
                    <div className="flex space-x-12 mb-2">
                        <InputField
                            label="Mã lô"
                            id="seedId"
                            value={seedId}
                            onChange={handleInputChange(setSeedId)}
                            placeholder="Nhập mã lô"
                        />
                        <InputField
                            label="Tên lô"
                            id="seedName"
                            value={seedName}
                            onChange={handleInputChange(setSeedName)}
                            placeholder="Nhập tên lô"
                        />
                    </div>

                    <SelectField
                        label="Mã Ao gốc"
                        id="originPondId"
                        value={originPondId}
                        onChange={handleInputChange(setOriginPondId)}
                        options={[
                            { value: '', label: 'Không có' },
                            ...pondOptions,
                        ]}
                    />

                    <FileInputField
                        label="Giấy chứng nhận"
                        id="certificates"
                        onChange={handleFileChange}
                    />

                    <div className="flex space-x-12 mb-2">
                        <InputField
                            label="Kích thước Tôm (cm)"
                            id="sizeShrimp"
                            type="number"
                            value={sizeShrimp}
                            onChange={handleInputChangeWithValidation(setSizeShrimp)} 
                            placeholder="Nhập kích thước tôm"
                            min="0"
                        />
                        <InputField
                            label="Số lượng Tôm (kg)"
                            id="amountShrimp"
                            type="number"
                            value={amountShrimp}
                            onChange={handleInputChangeWithValidation(setAmountShrimp)} // setAmountShrimp
                            placeholder="Nhập số lượng tôm"
                            min="0"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-600 text-center mb-2">{errorMessage}</p>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={cl("bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md w-40", {
                                'opacity-50 cursor-not-allowed': isLoading || !seedId || !seedName || sizeShrimp <= 0 || amountShrimp <= 0
                            })}
                            disabled={isLoading || !seedId || !seedName || sizeShrimp <= 0 || amountShrimp <= 0}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(ActiveCard);
