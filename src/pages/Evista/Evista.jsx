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
        data: [35, 34, 33, 32, 31, 30, 29, 28, 27, 26],
      },
      {
        name: 'PH',
        data: [7.5, 7.4, 7.3, 7.2, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7],
      },
    ],
    options: {
      chart: {
        height: 254, // Giảm chiều cao biểu đồ
        type: chartType,
        zoom: {
          enabled: true,
        },
      },
      xaxis: {
        categories: ['16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '24h', '01h'],
      },
      yaxis: {
        title: {
          text: selectedParameter === 'PH' ? 'PH' : 'Nhiệt độ (°C)',
        },
      },
      colors:
        selectedParameter === 'Nhiệt độ'
          ? ['#FF4560']
          : selectedParameter === 'PH'
          ? ['#00E396']
          : ['#FF4560', '#00E396'],
      stroke: {
        curve: 'smooth',
      },
    },
  };

  const filteredSeries = selectedParameter
    ? chartData.series.filter((serie) => serie.name === selectedParameter)
    : chartData.series;

  const timeLabels = chartData.options.xaxis.categories;

  return (
    <div className="flex w-full bg-gray-50 h-screen overflow-hidden"> {/* Sử dụng nền sáng */}
      <aside>
        <Sidebar />
      </aside>
      <div className="flex-grow p-6 space-y-6"> {/* Giảm padding và thêm khoảng cách giữa các phần tử */}
        <h1 className="text-2xl font-bold text-gray-700 flex items-center space-x-2"> {/* Tăng kích cỡ tiêu đề */}
          <span>💧</span> 
          <span>Thông số môi trường</span>
        </h1>
        
        <div className=""> {/* Nền trắng, bo tròn và đổ bóng */}
          <div className="flex items-center space-x-4"> {/* Khoảng cách giữa các dropdown */}
            <Dropdown
              height={184}
              items={pondTypes}
              buttonLabel="Loại ao"
              onChange={handlePondTypeChange}
            />
            <Dropdown
              height={184}
              items={pondOptions}
              buttonLabel="Chọn ao"
              onChange={handlePondChange}
            />
            <Dropdown
              height={184}
              items={parameter}
              buttonLabel="Thông số"
              onChange={handleParameterChange}
            />
          </div>
        </div>

        <div className="flex space-x-4"> {/* Thêm khoảng cách giữa các nút */}
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
              chartType === 'line' ? 'bg-pink-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            Biểu đồ
          </button>
          <button
            onClick={() => setChartType('table')}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
              chartType === 'table' ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            Dạng bảng
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md overflow-auto"> {/* Bo tròn và đổ bóng */}
          {chartType === 'table' ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left font-medium text-gray-700">Thông số</th>
                  {timeLabels.map((time) => (
                    <th key={time} className="py-2 px-4 border-b text-left font-medium text-gray-700">
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSeries.map((serie) => (
                  <tr key={serie.name}>
                    <td className="py-2 px-4 border-b text-gray-600">{serie.name}</td>
                    {serie.data.map((value, index) => (
                      <td key={index} className="py-2 px-4 border-b text-gray-600">{value}</td>
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
