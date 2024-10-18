import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Dropdown from '../../components/Dropdown/Dropdown';
import choosePondA from '../../utils/constants/choosePondA';
import choosePondB from '../../utils/constants/choosePondB';
import parameter from '../../utils/constants/parameter';
import pondTypes from '../../utils/constants/pondTypes';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';

function Evista() {
  const navigate = useNavigate();
  const [selectedPondType, setSelectedPondType] = useState(null);
  const [pondOptions, setPondOptions] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [selectedPonds, setSelectedPonds] = useState([]);
  const [pondData, setPondData] = useState({});
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
        tickAmount: 10,
        labels: {
          rotate: -45,
          rotateAlways: true,
          formatter: function(val, timestamp) {
            return new Date(timestamp).toLocaleTimeString();
          }
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
    },
  });

  const parameterLimits = {
    Ph: { min: 7.5, max: 8.5 },
    O2: { min: 3, max: 7 },
    Temperature: { min: 25, max: 33 }
  };

  useEffect(() => {
    if (selectedPond && !selectedParameter) {
      fetchAllParameters(selectedPond);
    } else if (selectedPond && selectedParameter) {
      fetchData(selectedParameter).then(data => processChartData(data));
    }
  }, [selectedPond, selectedParameter]);

  const handlePondTypeChange = (selectedItem) => {
    setSelectedPondType(selectedItem);
    setPondOptions(selectedItem === 'Ao ương' ? choosePondA : choosePondB);
  };

  const handlePondChange = (selectedItem) => {
    setSelectedPond(selectedItem);
  };

  const handleParameterChange = (selectedItem) => {
    setSelectedParameter(selectedItem);
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
    const categories = data.map(d => new Date(d.timestamp).toISOString());
    const values = data.map(d => parseFloat(d.value));

    setChartData({
      ...chartData,
      series: [{ name: selectedParameter, data: values }],
      options: {
        ...chartData.options,
        xaxis: { categories },
        yaxis: { title: { text: selectedParameter } }
      }
    });
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
                x: new Date(d.timestamp).toLocaleString(),
                y: parseFloat(d.value)
              }));

              const { min, max } = parameterLimits[param] || { min: null, max: null };

              return (
                <div key={param} className="parameter-chart w-1/3">
                  <h3 className="text-center">{param}</h3>
                  <Chart options={{
                    ...chartData.options,
                    xaxis: { categories: data.map(d => d.x) },
                    annotations: {
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
                    }
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
          <Dropdown items={pondTypes} buttonLabel="Loại ao" onChange={handlePondTypeChange} />
          <Dropdown items={pondOptions} buttonLabel="Chọn ao" onChange={handlePondChange} />
          <Dropdown items={parameter} buttonLabel="Thông số" onChange={handleParameterChange} />
          <button onClick={addPond} className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700 flex items-center space-x-2">
            <FaPlus /> <span>Thêm Ao</span>
          </button>
        </div>
        <div className="scrollable-chart-list bg-white p-4 rounded-lg shadow-md overflow-auto" style={{ maxHeight: '400px' }}>
          {renderCharts()}
        </div>
      </div>
    </div>
  );
}

export default Evista;
