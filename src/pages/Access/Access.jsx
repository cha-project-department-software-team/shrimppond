import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { FaSearch } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from "react-toastify"; // Import thêm toast
import 'react-toastify/dist/ReactToastify.css';

function Access() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [lotOptions, setLotOptions] = useState([]);
  const [harvestTimeOptions, setHarvestTimeOptions] = useState([]);
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedHarvestTime, setSelectedHarvestTime] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Create a reference for the QR code canvas
  const qrCodeRef = useRef(null);

  // Fetch lot options
  useEffect(() => {
    const fetchLotOptions = async () => {
      try {
        const response = await axios.get('https://shrimppond.runasp.net/api/Traceability/GetSeedId?pageSize=200&pageNumber=1');
        setLotOptions(response.data.map(lot => ({ id: lot.seedId, label: lot.seedId })));
      } catch (error) {
        console.error('Error fetching lot options: ', error);
      }
    };
    fetchLotOptions();
  }, []);

  // Fetch harvest time options
  useEffect(() => {
    const fetchHarvestTimes = async () => {
      try {
        const response = await axios.get('https://shrimppond.runasp.net/api/Traceability/GetTimeHarvest?pageSize=200&pageNumber=1');
        setHarvestTimeOptions(response.data.map(time => ({ id: time.harvestTime, label: time.harvestTime })));
      } catch (error) {
        console.error('Error fetching harvest times: ', error);
      }
    };
    fetchHarvestTimes();
  }, []);

  const fetchData = async () => {
    if (!selectedLot || !selectedHarvestTime) {
      toast.warning('Vui lòng chọn cả lô và lần thu hoạch!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://shrimppond.runasp.net/api/Traceability?SeedId=${selectedLot}&HarvestTime=${selectedHarvestTime}&pageSize=200&pageNumber=1`
      );
  
      if (!response.data || Object.keys(response.data).length === 0) {
        toast.warning('Không có lần thu hoạch.');
        setData(null);
      } else {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      toast.error('Không có lần thu hoạch nào.');
    } finally {
      setLoading(false);
    }
  };
  
  

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

  const downloadQRCode = () => {
    const canvas = qrCodeRef.current;
    const imageURI = canvas.toDataURL("image/png"); // Convert canvas to data URL
    const link = document.createElement("a");
    link.href = imageURI;
    link.download = "QRCode.png"; // Name for the downloaded file
    link.click(); // Trigger the download
  };

  const downloadCertificateAsPDF = (base64, index) => {
    const pdf = new jsPDF();
    pdf.addImage(base64, 'JPEG', 10, 10, 180, 160);
    pdf.save(`Certificate_${index + 1}.pdf`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 space-y-6">
        <h1 className="text-2xl font-bold text-black-700">Truy xuất nguồn gốc</h1>

        <div className="flex space-x-4 mb-6">
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lô</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
            >
              <option value="" disabled>
                Lô
              </option>
              {lotOptions.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lần thu hoạch</label>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
              value={selectedHarvestTime}
              onChange={(e) => setSelectedHarvestTime(e.target.value)}
            >
              <option value="" disabled>
                Chọn lần thu hoạch
              </option>
              {harvestTimeOptions.map((time) => (
                <option key={time.id} value={time.id}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end w-1/3">
            <button
              className="p-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 w-10 h-10"
              onClick={fetchData}
              disabled={loading}
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {loading ? (
          // Spinner loading effect here
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
            <p className="text-lg text-gray-500">Loading data...</p>
          </div>
        ) : data ? (
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
                {data.certificates.map((base64, index) => {
                  // Hàm tự động nhận diện loại file từ base64
                  const detectFileType = (base64) => {
                    // Kiểm tra nếu base64 không hợp lệ
                    if (!base64) {
                      return 'pdf';  // Mặc định trả về PDF nếu không có base64
                    }
                  
                    // Loại bỏ phần base64 header (bỏ qua "data:{mime};base64,")
                    const base64Data = base64.split(',')[1] || base64;
                  
                    // Kiểm tra dữ liệu base64 có hợp lệ không
                    if (!base64Data) {
                      return 'pdf';  // Trả về 'pdf' nếu không có base64Data
                    }
                  
                    // Các magic bytes đặc trưng của một số loại tệp phổ biến
                    if (base64Data.startsWith('JVBER')) {
                      return 'pdf';  // PDF
                    } else if (base64Data.startsWith('iVBOR')) {
                      return 'png';  // PNG
                    } else if (base64Data.startsWith('/9j/')) {
                      return 'jpeg';  // JPEG/JPG
                    } else if (base64Data.startsWith('R0lG')) {
                      return 'gif';  // GIF
                    } else if (base64Data.startsWith('SUQz')) {
                      return 'mp3';  // MP3
                    } else if (base64Data.startsWith('UEsDB')) {
                      return 'docx';  // DOCX (ZIP)
                    } else if (base64Data.startsWith('TVqQA')) {
                      return 'xlsx';
                    } else if (base64Data.startsWith('0x504B0304')) {
                      return 'zip';  // ZIP (có thể chứa bất kỳ loại file nào)
                    }
                    
                    // Nếu không nhận diện được, trả về mặc định là pdf
                    return 'pdf';
                  };
                
                  // Xác định loại tệp từ base64
                  const fileType = detectFileType(base64);
                
                  // Các MIME types tương ứng với các loại file
                  const mimeTypes = {
                    pdf: "application/pdf",
                    png: "image/png",
                    jpeg: "image/jpeg",
                    jpg: "image/jpeg",
                    gif: "image/gif",
                    mp3: "audio/mpeg",
                    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    zip: "application/zip",  // MIME type cho file ZIP
                    // Thêm các loại file khác nếu cần
                  };
                
                  // Lấy MIME type tương ứng
                  const mimeType = mimeTypes[fileType]
                
                  return (
                    <div key={index} className="mb-1">
                      <a
                        href={`data:${mimeType};base64,${base64}`}
                        download={`Certificate_${index + 1}.${fileType}`}
                        className="text-blue-500 underline"
                      >
                        Download Certificate {index + 1}
                      </a>
                    </div>
                  );
                })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.daysOfRearing}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.farmName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.address}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Vui lòng chọn mã lô và số lần thu hoạch.</p>
        )}

        <div className="flex flex-col items-center mt-6">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md mt-4 w-1/4"
            onClick={() => setShowQRCode(true)}
          >
            Xuất QR
          </button>
          {showQRCode && data && (
            <div className="mt-4 p-4 bg-white shadow-lg rounded-lg" onClick={downloadQRCode}>
              <QRCodeCanvas ref={qrCodeRef} value={generateQRCodeData()} size={200} />
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

export default Access;
