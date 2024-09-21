import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

function StatusPage() {
    const navigate = useNavigate();
    const [farms, setFarms] = useState([
        { id: 1, name: "Trang Trại 1", address: "Địa chỉ 1" },
        { id: 2, name: "Trang Trại 2", address: "Địa chỉ 2" }
    ]);

    const [farmName, setFarmName] = useState('');
    const [farmAddress, setFarmAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!farmName || !farmAddress) {
            // Bạn có thể hiển thị thông báo lỗi ở đây nếu cần
            alert('Vui lòng nhập cả tên và địa chỉ trang trại.');
            return;
        }

        addFarm();
    };

    const addFarm = () => {
        const newFarm = { id: farms.length + 1, name: farmName, address: farmAddress };
        setFarms([...farms, newFarm]);
        setFarmName('');
        setFarmAddress('');
    };

    const deleteFarm = (id) => {
        setFarms(farms.filter(farm => farm.id !== id));
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-grow flex flex-col items-center justify-start p-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-6">
                    <h1 className="text-lg font-bold mb-4">Thông tin trang trại</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Tên trang trại"
                            required
                        />
                        <input
                            type="text"
                            value={farmAddress}
                            onChange={(e) => setFarmAddress(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Địa chỉ trang trại"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Thêm trang trại
                        </button>
                    </form>
                    <div>
                        <h2 className="text-lg font-semibold">Danh sách trang trại</h2>
                        <div className="divide-y divide-gray-200">
                            {farms.map(farm => (
                                <div key={farm.id} className="flex justify-between items-center p-2">
                                    <span>{farm.name} - {farm.address}</span>
                                    <button
                                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                        onClick={() => deleteFarm(farm.id)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusPage;
