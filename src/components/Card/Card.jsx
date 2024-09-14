import React, { useState } from 'react';
import { FaEllipsisV} from 'react-icons/fa';
import { actions } from '../../utils/constants'
import { extraActions } from '../../utils/constants'


function Card({ pondId, status }) {  // Không cần props actions từ cha
  const [extra, setExtra] = useState(false);



  return (
    <div className="flex-1 flex flex-col transition-all rounded-xl max-w-48 relative">
      <div className="flex justify-between w-full bg-[#00A9EA] rounded-t-lg border border-black">
        <h1 className="text-black text-2xl font-bold ml-3 self-center">{pondId}</h1>
        <div className="text-black text-right text-xl mr-3 font-bold my-[-4px]">
          <h2>22</h2>
          <h2>{status}</h2>
        </div>
      </div>

      {/* Phần nội dung actions với map */}
      <div className="flex flex-col w-full py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black">
        <div className="flex gap-x-1">
          {actions.map((action) => (
            <div key={action.id} className={`w-9 h-8 ${action.bgColor} rounded-xl flex items-center justify-center`}>
              {action.icon}
            </div>
          ))}
          <div className="flex items-center justify-center">
            <FaEllipsisV
              onClick={() => setExtra((prev) => !prev)}
              className="text-black text-xl cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Extra actions hiển thị khi click vào FaEllipsisV */}
      {extra && (
        <div className="absolute bottom-0 left-0 flex flex-nowrap gap-x-1 bg-white p-1 rounded-lg z-50 border border-black max-w-48">
          {extraActions.map((extraAction) => (
            <div key={extraAction.id} className={`w-8 h-8 ${extraAction.bgColor} rounded-xl flex items-center justify-center`}>
              {extraAction.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Card;
