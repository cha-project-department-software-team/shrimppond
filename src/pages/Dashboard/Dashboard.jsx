import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import PondSummary from '../../components/PondSummary/PondSummary';
import Modal from '../../components/Modal';
import DeleteModal from '../../components/DeleteModal';
import useCallApi from '../../hooks/useCallApi';
import { arrayTest } from '../../utils/constants/index';
import { useSelector } from 'react-redux';
import { DashboardRequestApi } from '../../services/api';

function Dashboard() {
  const callApi = useCallApi();

  const expanded = useSelector((state) => state.sidebar.expanded);
  const [isModal, setIsModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [pondTypes, setPondTypes] = useState([]); // State để lưu danh sách pondTypes

  // Hàm lấy dữ liệu PondType từ API
  const fetchPondTypes = useCallback(() => {
    callApi(
      () => DashboardRequestApi.pondTypeRequest.getPondTypeRequest(), 
      (res) => {
        setPondTypes(res); // Lưu dữ liệu vào state pondTypes
      },
      "Lấy danh sách khối ao thất bại!"
    );
  }, [callApi]);

  // Gọi hàm fetchPondTypes khi component được mount
  useEffect(() => {
    fetchPondTypes();
  }, [fetchPondTypes]);

  return (
    <div className="flex">
      <aside>
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col transition-all m-2 bg-slate-300 rounded-xl items-center max-w-[90%]">
        <div className="flex w-[90%] h-32 rounded-xl gap-3 justify-around mt-3">
          <div className="flex flex-col items-center justify-center w-[18%] h-full max-w-[90%] max-h-[90%] rounded-xl border-2 shadow-xl border-sky-500 bg-white">
            <h1 className="uppercase text-xl font-semibold">Tổng số ao</h1>
            <span className="font-bold text-5xl">{pondTypes.length}</span> {/* Hiển thị tổng số khối ao */}
          </div>
          <div className="flex flex-col items-center justify-center w-[20%] h-full max-w-[90%] max-h-[90%] rounded-xl border-2 shadow-xl border-sky-500 bg-white">
            <h1 className="uppercase text-xl font-semibold md:text-xl">Số ao nuôi</h1>
            <span className="font-bold text-5xl text-green-600/[.86]">04</span> {/* Tùy chỉnh số ao nuôi */}
          </div>
          <div className="flex flex-col items-center justify-center w-[20%] h-full max-w-[90%] max-h-[90%] rounded-xl border-2 shadow-xl border-sky-500 bg-white">
            <h1 className="uppercase text-xl font-semibold md:text-xl">Môi trường</h1>
            <span className="font-bold text-4xl">Bổ điều</span>
          </div>
        </div>

        {/* Hiển thị PondSummary cho từng pondType */}
        {pondTypes.map((pondType) => (
          <PondSummary
            arrayTest={arrayTest}
            key={pondType.pondTypeId} // Key là pondTypeId
            pondTypeName={pondType.pondTypeName} // Truyền pondTypeName vào PondSummary
            isDeleteModal = {isDeleteModal}
            setIsDeleteModal = {setIsDeleteModal}
          />
        ))}

        <button
          onClick={() => { setIsModal(true); }}
          className="fixed bottom-5 w-1/6 rounded-2xl h-12 bg-[#61CBF4]/[.90] cursor-pointer"
        >
          <h1>Tạo khối</h1>
        </button>
        <Modal
          isModal={isModal}
          setIsModal={setIsModal}
          onPostSuccess={fetchPondTypes} // Truyền callback để fetch dữ liệu sau POST
        />
        <DeleteModal 
          isDeleteModal={isDeleteModal}
          setIsDeleteModal={setIsDeleteModal}
        />

      </div>
    </div>
  );
}

export default Dashboard;
