import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import PondSummary from '../../components/PondSummary/PondSummary';
import { arrayTest } from '../../utils/constants/index';
import Modal from '../../components/Modal/Modal';
import useCallApi from '../../hooks/useCallApi'

function Dashboard() {
  const callApi = useCallApi()
  
  const [expanded, setExpanded] = useState(true);
  const [isModal, setIsModal] = useState(false);

  return (
    <div className="flex">
      <aside>
        {/* Truyền state expanded và setExpanded vào Sidebar */}
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
      </aside>
      <div className="flex-1 flex flex-col transition-all m-2 bg-slate-300 rounded-xl items-center max-w-[90%]">
        
        <div className="flex w-[90%] h-32 rounded-xl gap-3 justify-around mt-3">
          <div className="flex flex-col items-center justify-center w-[18%] h-full max-w-[90%] max-h-[90%] rounded-xl border-2 shadow-xl border-sky-500 bg-white">
            <h1 className="uppercase text-xl font-semibold">tổng số ao</h1>
            <span className="font-bold text-5xl">06</span>
          </div>
          <div className="flex flex-col items-center justify-center w-[20%] h-full max-w-[90%] max-h-[90%] rounded-xl border-2 shadow-xl border-sky-500 bg-white">
            <h1 className="uppercase text-xl font-semibold md:text-xl">Số ao nuôi</h1>
            <span className="font-bold text-5xl text-green-600/[.86]">04</span>
          </div>
          <div className="flex flex-col items-center justify-center w-[20%] h-full max-w-[90%] max-h-[90%] rounded-xl border-2 shadow-xl border-sky-500 bg-white">
            <h1 className="uppercase text-xl font-semibold md:text-xl">Môi trường</h1>
            <span className="font-bold text-4xl">bổ điều</span>
          </div>
        </div>

        <PondSummary
          expanded={expanded}
          arrayTest={arrayTest}
        />

        <button
          onClick={() => { setIsModal(true); }}
          className="fixed bottom-5 w-1/6 rounded-2xl h-12 bg-[#61CBF4]/[.90] cursor-pointer"
        >
          <h1>Tạo khối</h1>
        </button>
        <Modal
          isModal={isModal}
          setIsModal={setIsModal}
        />
      </div>
    </div>
  );
}

export default Dashboard;
