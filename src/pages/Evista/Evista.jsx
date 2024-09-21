import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Dropdown from '../../components/Dropdown/Dropdown';
import choosePondA from '../../utils/constants/choosePondA';
import choosePondB from '../../utils/constants/choosePondB';
import parameter from '../../utils/constants/parameter';
import pondTypes from '../../utils/constants/pondTypes';
import Chart from 'react-apexcharts';
import { EvistaRequestApi } from '../../services/api';

function Evista() {
  const navigate = useNavigate();

  const [chartType, setChartType] = useState('line');
  const [selectedPondType, setSelectedPondType] = useState(null);
  const [pondOptions, setPondOptions] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const handlePondTypeChange = (selectedItem) => {
    setSelectedPondType(selectedItem);

    if (selectedItem === 'Ao ương') {
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
        height: 254,
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
          text: selectedParameter === 'PH' ? 'PH' : (selectedParameter === 'Nhiệt độ (°C)' ? 'Nhiệt độ (°C)' : 'Các thông số'),
        },
      },
            
      colors: selectedParameter === 'Nhiệt độ' ? ['#FF4560'] : selectedParameter === 'PH' ? ['#00E396'] : ['#FF4560', '#00E396'],
      stroke: {
        curve: 'smooth',
      },
    },
  };

  const timeLabels = chartData.options.xaxis.categories;
  const filteredSeries = selectedParameter
    ? chartData.series.filter((serie) => serie.name === selectedParameter)
    : chartData.series;

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
        
        <div className="">
          <div className="flex items-center space-x-4">
            <Dropdown
              height={180}
              items={pondTypes}
              buttonLabel="Loại ao"
              onChange={handlePondTypeChange}
            />
            <Dropdown
              height={180}
              items={pondOptions}
              buttonLabel="Chọn ao"
              onChange={handlePondChange}
            />
            <Dropdown
              height={180}
              items={parameter}
              buttonLabel="Thông số"
              onChange={handleParameterChange}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${chartType === 'line' ? 'bg-pink-500' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Biểu đồ
          </button>
          <button
            onClick={() => setChartType('table')}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition ${chartType === 'table' ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Dạng bảng
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md overflow-auto" style={{ maxHeight: '400px' }}>
          {chartType === 'table' ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="sticky top-0 bg-gray-100 z-10"> {/* Sticky header implementation */}
                <tr>
                  <th className="py-2 px-4 border-b text-left font-medium text-gray-700">Giờ</th>
                  {filteredSeries.map((serie) => (
                    <th key={serie.name} className="py-2 px-4 border-b text-left font-medium text-gray-700">{serie.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeLabels.map((time, timeIndex) => (
                  <tr key={time}>
                    <td className="py-2 px-4 border-b font-medium text-gray-700">{time}</td>
                    {filteredSeries.map(serie => (
                      <td key={`${serie.name}-${timeIndex}`} className="py-2 px-4 border-b text-gray-600">
                        {serie.data[timeIndex]}
                      </td>
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
              height={254}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Evista;
