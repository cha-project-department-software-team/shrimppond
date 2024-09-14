import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Dropdown from '../../components/Dropdown/Dropdown';
import choosePondA from '../../utils/constants/choosePondA';
import choosePondB from '../../utils/constants/choosePondB';
import parameter from '../../utils/constants/parameter';
import pondTypes from '../../utils/constants/pondTypes';
import Chart from 'react-apexcharts';

function Evista() {
  const navigate = useNavigate();

  const [chartType, setChartType] = useState('line');
  const [selectedPondType, setSelectedPondType] = useState(null);
  const [pondOptions, setPondOptions] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const handlePondTypeChange = (selectedItem) => {
    setSelectedPondType(selectedItem);

    if (selectedItem === 'Ao ươm') {
      setPondOptions(choosePondA);
    } else if (selectedItem === 'Ao thương phẩm') {
      setPondOptions(choosePondB);
    } else {
      setPondOptions([]);
    }
  };

  const handlePondChange = (selectedItem) => {
    setSelectedPond(selectedItem);
  };

  const handleParameterChange = (selectedItem) => {
    setSelectedParameter(selectedItem);
  };

  const chartData = {
    series: [
      {
        name: 'Nhiệt độ',
        data: [35, 34, 33, 32, 31, 30, 29, 28, 27, 26]
      },
      {
        name: 'PH',
        data: [7.5, 7.4, 7.3, 7.2, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7]
      }
    ],
    options: {
      chart: {
        height: 250, // Giảm chiều cao biểu đồ
        type: chartType,
        zoom: {
          enabled: true
        }
      },
      xaxis: {
        categories: ['16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '24h', '01h']
      },
      yaxis: {
        title: {
          text: selectedParameter === 'PH' ? 'PH' : 'Nhiệt độ (°C)'
        }
      },
      colors: selectedParameter === 'Nhiệt độ'
                ? ['#FF4560']
                : selectedParameter === 'PH'
                ? ['#00E396']
                : ['#FF4560', '#00E396'],
      stroke: {
        curve: 'smooth'
      }
    }
  };

  const filteredSeries = selectedParameter
    ? chartData.series.filter((serie) => serie.name === selectedParameter)
    : chartData.series;

  const timeLabels = chartData.options.xaxis.categories;

  return (
    <div className="flex h-screen overflow-hidden"> {/* Đảm bảo trang không cuộn */}
      <aside className="w-1/5">
        <Sidebar />
      </aside>
      <div className="flex-grow p-4"> {/* Giảm padding */}
        <h1 className="text-lg font-bold mb-4 flex items-center">
          <span className="mr-2">💧</span> Thông số môi trường
        </h1>
        <div className="mb-4">
          <div className="flex items-center space-x-2"> {/* Giảm khoảng cách giữa các dropdown */}
            <Dropdown
              height={120} // Giảm chiều cao dropdown
              items={pondTypes} 
              buttonLabel="Loại ao" 
              onChange={handlePondTypeChange} 
            />
            <Dropdown 
              height={120}
              items={pondOptions} 
              buttonLabel="Chọn ao" 
              onChange={handlePondChange}
            />
            <Dropdown 
              height={120}
              items={parameter} 
              buttonLabel="Thông số" 
              onChange={handleParameterChange}
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <button
            onClick={() => setChartType('line')}
            className={`px-2 py-1 mr-2 text-white rounded ${chartType === 'line' ? 'bg-pink-500' : 'bg-gray-300'}`}
          >
            Biểu đồ
          </button>
          <button
            onClick={() => setChartType('table')}
            className={`px-2 py-1 text-white rounded ${chartType === 'table' ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            Dạng bảng
          </button>
        </div>
        <div className="overflow-auto"> {/* Giới hạn chiều cao của vùng biểu đồ/bảng */}
          {chartType === 'table' ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-1 px-2 border border-gray-300 text-center">Thông số</th>
                  {timeLabels.map((time) => (
                    <th key={time} className="py-1 px-2 border border-gray-300 text-center">{time}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSeries.map((serie) => (
                  <tr key={serie.name}>
                    <td className="py-1 px-2 border border-gray-300 text-center">{serie.name}</td>
                    {serie.data.map((value, index) => (
                      <td key={index} className="py-1 px-2 border border-gray-300 text-center">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Chart
              options={chartData.options}
              series={filteredSeries}
              type={chartType}
              height={254} // Giảm chiều cao của biểu đồ
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Evista;
