
import React, { useState } from 'react';
import { FaOdnoklassniki, FaFilter, FaFan, FaTint, FaEllipsisV } from 'react-icons/fa';
import { FaBox, FaExchangeAlt, FaTrash, } from 'react-icons/fa';
import { BsInfoCircle,} from 'react-icons/bs';
import { FaShrimp } from "react-icons/fa6";



function Card({pondId, status}) {
  const [extra, setExtra] = useState(false);

  

  return (
    <div className="flex-1 flex flex-col transition-all rounded-xl max-w-48 relative shadow-xl">
      <div className="flex justify-between w-full bg-[#00A9EA] rounded-t-lg border border-black">
        <h1 className="text-black text-2xl font-bold ml-3 self-center">{pondId}</h1>
        <div className="text-black text-right text-xl mr-3 font-bold my-[-4px]">
          <h2>22</h2>
          <h2>{status}</h2>
        </div>
      </div>

      <div className="flex flex-col w-full py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black">
        <div className="flex gap-x-1">
          <div className="w-9 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaOdnoklassniki className="text-white text-xl" />
          </div>
          <div className="w-9 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaFilter className="text-white text-xl" />
          </div>
          <div className="w-9 h-8 bg-green-600 rounded-xl flex items-center justify-center">
            <FaFan className="text-white text-xl" />
          </div>
          <div className="w-9 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaTint className="text-white text-xl" />
          </div>
          <div className="flex items-center justify-center">
            <FaEllipsisV
              onClick={() => {setExtra((prev) => !prev)
                console.log(extra)
              }}
              className="text-black text-xl cursor-pointer"
            />
          </div>
        </div>
      </div>

      {extra && (
        <div className="absolute bottom-0 left-0 flex flex-nowrap gap-x-1 bg-white p-1 rounded-lg z-50 border border-black max-w-48">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaBox className="text-white text-xl" />
          </div>
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaExchangeAlt className="text-white text-xl" />
          </div>
          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
            <BsInfoCircle className="text-white text-xl" />
          </div>
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaShrimp className="text-white text-xl" />
          </div>
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <FaTrash className="text-white text-xl" />
          </div>

        </div>
      )}
    </div>
  );
}

export default Card;