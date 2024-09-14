import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

function Food() {
    const navigate = useNavigate();

    const [selectedPond, setSelectedPond] = useState("A1");

    const [pondData, setPondData] = useState({
        A1: {
            date: '',
            rows: [{ name: "", type: "", quantity: "" }],
            infoType: 'thucan',
        },
        A2: {
            date: '',
            rows: [{ name: "", type: "", quantity: "" }],
            infoType: 'thucan',
        },
        A3: {
            date: '',
            rows: [{ name: "", type: "", quantity: "" }],
            infoType: 'thucan',
        }
    });

    const [foodNames, setFoodNames] = useState(["Tên"]);
    const [foodTypes, setFoodTypes] = useState(["Loại"]);
    const [medicineNames, setMedicineNames] = useState(["Tên"]);
    const [medicineTypes, setMedicineTypes] = useState(["Loại"]);

    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("");

    const handleAddName = () => {
        if (pondData[selectedPond].infoType === 'thucan') {
            if (newName && !foodNames.includes(newName)) {
                setFoodNames([...foodNames, newName]);
            }
        } else {
            if (newName && !medicineNames.includes(newName)) {
                setMedicineNames([...medicineNames, newName]);
            }
        }
        setNewName(""); // Clear the input after adding
    };

    const handleAddType = () => {
        if (pondData[selectedPond].infoType === 'thucan') {
            if (newType && !foodTypes.includes(newType)) {
                setFoodTypes([...foodTypes, newType]);
            }
        } else {
            if (newType && !medicineTypes.includes(newType)) {
                setMedicineTypes([...medicineTypes, newType]);
            }
        }
        setNewType(""); // Clear the input after adding
    };

    const handleAddRow = () => {
        setPondData((prevData) => ({
            ...prevData,
            [selectedPond]: {
                ...prevData[selectedPond],
                rows: [...prevData[selectedPond].rows, { name: "", type: "", quantity: "" }]
            }
        }));
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...pondData[selectedPond].rows];
        updatedRows[index][field] = value;
        setPondData((prevData) => ({
            ...prevData,
            [selectedPond]: {
                ...prevData[selectedPond],
                rows: updatedRows
            }
        }));
    };

    const handleDateChange = (date) => {
        setPondData((prevData) => ({
            ...prevData,
            [selectedPond]: {
                ...prevData[selectedPond],
                date: date
            }
        }));
    };

    const handleInfoTypeChange = (infoType) => {
        setPondData((prevData) => ({
            ...prevData,
            [selectedPond]: {
                ...prevData[selectedPond],
                infoType: infoType
                // Do not reset rows here
            }
        }));
    };

    const handlePondChange = (pond) => {
        setSelectedPond(pond);
    };

    const handleUpdate = () => {
        console.log("Data for pond", selectedPond, ":", pondData[selectedPond]);
        alert(`Data for pond ${selectedPond} has been updated!`);
    };

    const isThucAn = pondData[selectedPond].infoType === 'thucan';
    const dateLabel = isThucAn ? 'Ngày cho ăn' : 'Ngày điều trị';
    const quantityLabel = isThucAn ? 'Số lượng (kg)' : 'Liều lượng (g)';
    const names = isThucAn ? foodNames : medicineNames;
    const types = isThucAn ? foodTypes : medicineTypes;

    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="flex flex-col w-full p-8 bg-gray-50">
                    <div className="flex space-x-4 mb-6">
                        <div className="w-1/2">
                            <label htmlFor="pond" className="block text-sm font-medium text-gray-700">Chọn ao</label>
                            <select
                                id="pond"
                                value={selectedPond}
                                onChange={(e) => handlePondChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="A1">Ao: A1</option>
                                <option value="A2">Ao: A2</option>
                                <option value="A3">Ao: A3</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="info" className="block text-sm font-medium text-gray-700">Thông tin</label>
                            <select
                                id="info"
                                value={pondData[selectedPond].infoType}
                                onChange={(e) => handleInfoTypeChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="thucan">Thức ăn</option>
                                <option value="thuoc">Thuốc</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-6">
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="pondName" className="block text-sm font-medium text-gray-700">Ao</label>
                                <input type="text" id="pondName" value={selectedPond} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 sm:text-sm" />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">{dateLabel}</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={pondData[selectedPond].date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="newName" className="block text-sm font-medium text-gray-700">Thêm Tên mới</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        id="newName" 
                                        value={newName} 
                                        onChange={(e) => setNewName(e.target.value)} 
                                        placeholder="Nhập tên mới"
                                        className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button onClick={handleAddName} className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md">+</button>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="newType" className="block text-sm font-medium text-gray-700">Thêm Loại mới</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        id="newType" 
                                        value={newType} 
                                        onChange={(e) => setNewType(e.target.value)} 
                                        placeholder="Nhập loại mới"
                                        className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button onClick={handleAddType} className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
                                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại</th>
                                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{quantityLabel}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pondData[selectedPond].rows.map((row, index) => (
                                        <tr key={index} className={`bg-gray-${index % 2 === 0 ? '50' : '100'}`}>
                                            <td className="px-6 py-4 border-b border-gray-200">
                                                <select
                                                    value={row.name}
                                                    onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                                                    className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    {names.map((name, i) => (
                                                        <option key={i} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200">
                                                <select
                                                    value={row.type}
                                                    onChange={(e) => handleRowChange(index, 'type', e.target.value)}
                                                    className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    {types.map((type, i) => (
                                                        <option key={i} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200">
                                                <input
                                                    type="number"
                                                    className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder={quantityLabel}
                                                    value={row.quantity}
                                                    onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between space-x-4 mt-4">
                            <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">+ Thêm hàng</button>
                            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Food;
