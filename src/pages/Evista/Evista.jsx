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
        height: 350,
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
    <div className="flex">
      <aside>
        <Sidebar />
      </aside>
      <div className="flex-grow pt-5 px-10">
        <h1 className="text-xl font-bold mb-6 flex items-center">
          <span className="mr-2">💧</span> Thông số môi trường
        </h1>
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Dropdown 
              items={pondTypes} 
              buttonLabel="Loại ao" 
              onChange={handlePondTypeChange} 
            />
            <Dropdown 
              items={pondOptions} 
              buttonLabel="Chọn ao" 
              onChange={handlePondChange}
            />
            <Dropdown 
              items={parameter} 
              buttonLabel="Thông số" 
              onChange={handleParameterChange}
            />
            <button className="ml-auto p-2 bg-gray-200 rounded">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m7-7l-7 7 7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center mb-6">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 mr-4 text-white rounded ${chartType === 'line' ? 'bg-pink-500' : 'bg-gray-300'}`}
          >
            Biểu đồ
          </button>
          <button
            onClick={() => setChartType('table')}
            className={`px-4 py-2 text-white rounded ${chartType === 'table' ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            Dạng bảng
          </button>
        </div>
        <div>
          {chartType === 'table' ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-gray-300 text-center">Thông số</th>
                  {timeLabels.map((time) => (
                    <th key={time} className="py-2 px-4 border border-gray-300 text-center">{time}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSeries.map((serie) => (
                  <tr key={serie.name}>
                    <td className="py-2 px-4 border border-gray-300 text-center">{serie.name}</td>
                    {serie.data.map((value, index) => (
                      <td key={index} className="py-2 px-4 border border-gray-300 text-center">{value}</td>
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
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Evista;
