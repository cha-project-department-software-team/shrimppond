import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Select from 'react-select';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Chart from 'react-apexcharts';
import Modal from 'react-modal'; // Import Modal từ react-modal

function Evista() {
  const navigate = useNavigate();
  const [selectedPondType, setSelectedPondType] = useState(null);
  const [pondOptions, setPondOptions] = useState([]);
  const [pondTypes, setPondTypes] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [selectedPonds, setSelectedPonds] = useState([]);
  const [pondData, setPondData] = useState({});
  const style = document.createElement('style');
        style.innerHTML = `.apexcharts-toolbar {z-index: 0 !important;}`;
        document.head.appendChild(style);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: true,
          type: 'x'
        },
        toolbar: {
          autoSelected: ''
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          rotate: -45,
          rotateAlways: true,
        }
      },
      yaxis: {
        title: {
          text: '',
        },
      },
      colors: ['#FF4560', '#00E396'],
      stroke: {
        curve: 'smooth',
      },
      annotations: {
        yaxis: []
      }
    },
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null);

  const parameterLimits = {
    Ph: { min: 7.5, max: 8.5 },
    O2: { min: 3.0, max: 7.0 },
    Temperature: { min: 25, max: 33 }
  };

  // Thiết lập App Element cho Modal để tránh cảnh báo
  useEffect(() => {
    Modal.setAppElement('#root'); // #root là id của phần tử gốc trong index.html
  }, []);

  useEffect(() => {
    fetchPondTypes();
  }, []);

  useEffect(() => {
    if (selectedPond && !selectedParameter) {
      fetchAllParameters(selectedPond);
    } else if (selectedPond && selectedParameter) {
      fetchData(selectedParameter).then(data => processChartData(data));
    }
  }, [selectedPond, selectedParameter]);

  useEffect(() => {
    if (selectedPondType) {
      fetchPonds();
    }
  }, [selectedPondType]);

  const fetchPondTypes = async () => {
    const url = 'http://shrimppond.runasp.net/api/PondType?pageSize=200&pageNumber=1';
    try {
      const response = await axios.get(url);
      const types = response.data.map(type => ({
        value: type.pondTypeId,
        label: type.pondTypeName
      }));
      setPondTypes(types);
    } catch (error) {
      console.error('Failed to fetch pond types:', error);
    }
  };

  const fetchPonds = async () => {
    const url = 'http://shrimppond.runasp.net/api/Pond?pageSize=200&pageNumber=1';
    try {
      const response = await axios.get(url);
      const filteredPonds = response.data.filter(pond => pond.pondTypeName === selectedPondType.label);
      const ponds = filteredPonds.map(pond => ({
        value: pond.pondId,
        label: pond.pondId
      }));
      setPondOptions(ponds);
    } catch (error) {
      console.error('Failed to fetch ponds:', error);
    }
  };

  const handlePondTypeChange = (selectedOption) => {
    setSelectedPondType(selectedOption);
  };

  const handlePondChange = (selectedOption) => {
    setSelectedPond(selectedOption.value);
  };

  const fetchData = async (parameter) => {
    const url = `http://shrimppond.runasp.net/api/Environment?pondId=${selectedPond}&name=${parameter}&startDate=2024-06-07&endDate=2024-09-25&pageSize=200&pageNumber=1`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch data for ${parameter}:`, error);
      return [];
    }
  };

  const fetchAllParameters = async (pond) => {
    const phData = await fetchData('Ph', pond);
    const o2Data = await fetchData('O2', pond);
    const tempData = await fetchData('Temperature', pond);
    
    setPondData(prevData => ({
      ...prevData,
      [pond]: { Ph: phData, O2: o2Data, Temperature: tempData }
    }));
  };

  const processChartData = (data) => {
    const categories = data.map(d => {
      const date = new Date(d.timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const values = data.map(d => parseFloat(d.value));

    setChartData(prevChartData => ({
      ...prevChartData,
      series: [{ name: selectedParameter, data: values }],
      options: {
        ...prevChartData.options,
        xaxis: { categories },
        yaxis: { title: { text: selectedParameter } }
      }
    }));
  };

  const addPond = () => {
    if (selectedPond && !selectedPonds.includes(selectedPond)) {
      setSelectedPonds([...selectedPonds, selectedPond]);
      fetchAllParameters(selectedPond);
    }
  };

  const deletePond = (pond) => {
    setSelectedPonds(selectedPonds.filter(p => p !== pond));
    const newPondData = { ...pondData };
    delete newPondData[pond];
    setPondData(newPondData);
  };

  const renderCharts = () => {
    return selectedPonds.map((pond) => {
      const dataToRender = pondData[pond] || {};

      return (
        <div key={pond} className="chart-container">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">{pond}</h2>
            <button 
              onClick={() => deletePond(pond)} 
              className="text-red-500 hover:text-red-700 focus:outline-none">
              <FaTrash />
            </button>
          </div>
          <div className="flex space-x-4">
            {Object.keys(dataToRender).map(param => {
              const data = dataToRender[param].map(d => ({
                x: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                y: parseFloat(d.value)
              }));

              const { min, max } = parameterLimits[param] || { min: null, max: null };

              const annotations = {
                yaxis: [
                  {
                    y: min,
                    borderColor: '#FF4560',
                    label: {
                      borderColor: '#FF4560',
                      style: {
                        color: '#fff',
                        background: '#FF4560',
                      },
                      text: `Min: ${min}`
                    }
                  },
                  {
                    y: max,
                    borderColor: '#00E396',
                    label: {
                      borderColor: '#00E396',
                      style: {
                        color: '#fff',
                        background: '#00E396',
                      },
                      text: `Max: ${max}`
                    }
                  }
                ]
              };

              return (
                <div key={param} className="parameter-chart w-1/3">
                  <h3 
                    className="text-center font-bold cursor-pointer"
                    onClick={() => {
                      setActiveChart({ param, data });
                      setIsModalOpen(true);
                    }}
                  >
                    {param}
                  </h3>
                  <Chart options={{
                    ...chartData.options,
                    xaxis: { categories: data.map(d => d.x) },
                    annotations: annotations
                  }}
                  series={[{ name: param, data: data.map(d => d.y) }]}
                  type="line" height={200} />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // setActiveChart(null); // đoạn này comment lại thôi chứ đừng xóa
  };

  return (
    <div className="flex w-full bg-gray-50 h-screen overflow-hidden">
      <aside>
        <Sidebar />
      </aside>
      <div className="flex-grow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center space-x-2">
          <span>💧</span>
          <span>Thông số môi trường</span>
        </h1>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pondType">
              Loại ao
            </label>
            <Select 
              options={pondTypes} 
              onChange={handlePondTypeChange} 
              placeholder="Chọn loại ao" 
              isClearable
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pondType">
              Ao
            </label>
            <Select 
              options={pondOptions} 
              onChange={handlePondChange} 
              placeholder="Chọn ao" 
              isClearable
            />
          </div>
          <button onClick={addPond} className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700 flex items-center space-x-2">
            <FaPlus /> <span>Thêm Ao</span>
          </button>
        </div>
        <div className="scrollable-chart-list bg-white p-4 rounded-lg shadow-md overflow-auto" style={{ maxHeight: '460px' }}>
          {renderCharts()}
        </div>
      </div>

      {/* Modal cho biểu đồ */} 
      <Modal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}  // Đóng modal khi click ra ngoài
        contentLabel="Biểu đồ lớn"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        shouldCloseOnOverlayClick={true}  // Kích hoạt tính năng click ra ngoài để đóng modal
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full"> {/* Tăng chiều dài modal */}
          <h2 className="text-xl font-bold mb-4">{activeChart?.param}</h2>
          <Chart 
            options={{ 
              ...chartData.options,
              xaxis: { categories: activeChart?.data.map(d => d.x) }
            }}
            series={[{ name: activeChart?.param, data: activeChart?.data.map(d => d.y) }]}
            type="line" 
            height={450}  // Tăng chiều cao biểu đồ trong modal
          />
          <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Đóng</button>
        </div>
      </Modal>
    </div>
  );
}

export default Evista;
