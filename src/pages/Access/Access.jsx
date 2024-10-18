import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { FaSearch } from 'react-icons/fa';
import jsPDF from 'jspdf';

function Access() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedPond, setSelectedPond] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://shrimppond.runasp.net/api/Traceability?SeedId=2112666&HarvestTime=2&pageSize=200&pageNumber=1'
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const generateQRCodeData = () => {
    if (!data) return '';
    return [
      `Mã lô: ${data.seedId}`,
      `Mã ao: ${data.harvestPondId}`,
      `Lần thu hoạch: ${data.harvestTime}`,
      `Số lượng thu hoạch: ${data.totalAmount}`,
      `Size tôm: ${data.size}`,
      `Giấy chứng nhận: ${data.certificates.length} giấy`,
      `Số ngày nuôi: ${data.daysOfRearing}`,
      `Trang trại: ${data.farmName}`,
      `Địa chỉ: ${data.address}`
    ].join('\n');
  };

  // Convert base64 certificate to PDF and download
  const downloadCertificateAsPDF = (base64, index) => {
    const pdf = new jsPDF();
    pdf.addImage(base64, 'JPEG', 10, 10, 180, 160); // Add the image to the PDF
    pdf.save(`Certificate_${index + 1}.pdf`); // Save the PDF
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Truy xuất nguồn gốc</h1>

        <div className="flex space-x-4 mb-6">
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lô</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
            >
              <option value="" disabled>
                Lô
              </option>
              <option value="lot1">Mã lô 1</option>
              <option value="lot2">Mã lô 2</option>
              <option value="lot3">Mã lô 3</option>
            </select>
          </div>

          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ao</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedPond}
              onChange={(e) => setSelectedPond(e.target.value)}
            >
              <option value="" disabled>
                Chọn ao
              </option>
              <option value="A01">A01</option>
              <option value="A02">A02</option>
              <option value="A03">A03</option>
              <option value="B01">B01</option>
              <option value="B02">B02</option>
              <option value="B03">B03</option>
            </select>
          </div>

          <div className="flex items-center w-1/3">
            <button className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>

        {data ? (
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã lô</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ao</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần thu hoạch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng thu hoạch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size tôm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giấy chứng nhận</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số ngày nuôi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trang trại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.seedId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.harvestPondId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.harvestTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.certificates.map((base64, index) => (
                    <div key={index} className="mb-1">
                      <a
                        href={`data:application/pdf;base64,${base64}`}
                        download={`Certificate_${index + 1}.pdf`}
                        className="text-blue-500 underline"
                      >
                        Download Certificate {index + 1}
                      </a>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.daysOfRearing}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.farmName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.address}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading data...</p>
        )}

        <div className="flex flex-col items-center mt-6">
          <button
            className="bg-green-500 text-white font-semibold py-2 px-6 rounded-md mt-4 w-1/4"
            onClick={() => setShowQRCode(true)}
          >
            Xuất QR
          </button>
          {showQRCode && (
            <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
              <QRCodeCanvas value={generateQRCodeData()} size={200} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Access;
