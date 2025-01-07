import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast từ react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho react-toastify

function StatusPage() {
    const navigate = useNavigate();
    const [farms, setFarms] = useState([]);
    const [farmName, setFarmName] = useState('');
    const [farmAddress, setFarmAddress] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [username, setUsername] = useState(''); // Username từ localStorage

    // Lấy username từ localStorage khi trang tải
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // Nếu không có username trong localStorage, chuyển hướng về trang login
            toast.error('Vui lòng đăng nhập lại!');
            navigate('/login');
        }
    }, [navigate]);

    // Gọi API để lấy danh sách trang trại
    const fetchFarms = async () => {
        if (!username) return; // Không gọi API nếu username chưa được set

        setLoading(true); // Start loading
        const url = `http://shrimppond.runasp.net/api/Farm?userName=${username}&pageSize=200&pageNumber=1`;
        console.log(username)
        try {
            const response = await axios.get(url);
            const farmData = response.data.map((farm, index) => ({
                id: index + 1, // Hoặc bạn có thể sử dụng farm.id nếu có
                name: farm.farmName,
                address: farm.address
            }));
            setFarms(farmData);
        } catch (error) {
            console.error('Failed to fetch farms:', error);
            toast.error('Không thể tải dữ liệu trang trại. Vui lòng thử lại.');
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchFarms(); // Lấy danh sách trang trại khi username có sẵn
    }, [username]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!farmName || !farmAddress) {
            toast.error('Vui lòng nhập cả tên và địa chỉ trang trại.');
            return;
        }

        addFarm();
    };

    const addFarm = async () => {
        const newFarm = { farmName, address: farmAddress };

        try {
            setLoading(true); // Start loading when adding farm

            const response = await axios.post('https://shrimppond.runasp.net/api/Farm', {
                ...newFarm,
                userName: username, // Đính kèm username vào API
            });

            // Sau khi thêm trang trại thành công, tải lại danh sách trang trại
            fetchFarms();

            setFarmName('');
            setFarmAddress('');
            toast.success('Thêm trang trại thành công!');
        } catch (error) {
            console.error('Failed to add farm:', error);
            toast.error('Không thể thêm trang trại. Vui lòng thử lại.');
        } finally {
            setLoading(false); // End loading
        }
    };

    const deleteFarm = async (farmName) => {
        try {
            setLoading(true); // Start loading when deleting farm
            await axios.delete(`https://shrimppond.runasp.net/api/Farm?FarmName=${encodeURIComponent(farmName)}&userName=${username}`);

            // Cập nhật lại danh sách farms sau khi xóa thành công
            fetchFarms();

            toast.success('Xóa trang trại thành công!');
        } catch (error) {
            console.error('Failed to delete farm:', error);
            toast.error('Không thể xóa trang trại. Vui lòng thử lại.');
        } finally {
            setLoading(false); // End loading
        }
    };

    // Hàm xử lý khi click vào một trang trại
    const handleFarmClick = () => {
        navigate('/'); // Chuyển hướng đến trang dashboard
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-grow flex flex-col items-center justify-start p-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-6">
                    <h1 className="text-lg font-bold mb-4">Thông tin trang trại</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Trang trại
                        </label>
                        <input
                            type="text"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Tên trang trại"
                            required
                        />
                        <label className="block text-sm font-medium text-gray-700">
                            Địa chỉ
                        </label>
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

                    {loading ? (
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
                            <p className="text-lg text-gray-500">Loading data...</p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold">Danh sách trang trại</h2>
                            <div className="max-h-56 overflow-y-auto divide-y divide-gray-200">
                                {farms.map(farm => (
                                    <div key={farm.id} className="flex justify-between items-center p-2">
                                        <span
                                            className="cursor-pointer text-blue-500 hover:underline"
                                            onClick={handleFarmClick}
                                        >
                                            {farm.name} - {farm.address}
                                        </span>
                                        <button
                                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                            onClick={() => deleteFarm(farm.name)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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

export default StatusPage;
