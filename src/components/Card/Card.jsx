import React, { useState } from 'react';
import { FaEllipsisV} from 'react-icons/fa';
import { actions } from '../../utils/constants'
import { extraActions } from '../../utils/constants'
import DeleteCard from '../DeleteCard'
import cl from "classnames"
import ActiveCard from '../../components/ActiveCard'
import { useNavigate } from 'react-router-dom';



function Card({ pondId, status, onDeleteCardSuccess, onPutSucces }) {  // Không cần props actions từ 
  const [isActiveModal, setIsActiveModal] = useState(false)
  const [extra, setExtra] = useState(false);
  const [isDeleteCard, setIsDeleteCard] = useState(false)

  const navigate = useNavigate()

  const handleHarvestClick = (pondId) => {
    // Điều hướng thẳng tới HarvestForm và truyền pondId qua state
    navigate('/harvest', { state: { pondId } });
};


  return (
    <>
      <div className="flex-1 flex flex-col transition-all rounded-xl max-w-48 relative">
      <div className= {cl("flex justify-between w-full rounded-t-lg border border-black",
        {
          "bg-[#00A9EA]": status,
          "bg-gray-400" : !status
        }
      )}>
        <h1 className="text-black text-2xl font-bold ml-3 self-center">{pondId}</h1>
        <div className="text-black text-right text-xl mr-3 font-bold my-[-4px]">
          <h2>22</h2>
          <h2>{status}</h2>
        </div>
      </div>

      {status ? (
  <div className="flex flex-col w-full py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black">
    <div className="flex gap-x-1">
      {actions.map((action) => (
        <div key={action.id} 
          className={`w-9 h-8 ${action.bgColor} rounded-xl flex items-center justify-center`}
        >
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
) : (
  <div className="flex flex-col py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black h-11 w-40 items-center">
    <button 
      className="bg-green-400 hover:bg-green-500 rounded-xl mt-1 w-28 font-semibold h-6"
      onClick={() => setIsActiveModal(true)} // Sửa đổi callback
    >
      Kích hoạt
    </button>
  </div>
)}


      {extra &&(
        <div className="absolute bottom-0 left-0 flex flex-nowrap gap-x-1 bg-white p-1 rounded-lg z-0 border border-black max-w-48">
          {extraActions.map((extraAction) => (
            <div key={extraAction.id} 
              className={`w-8 h-8 ${extraAction.bgColor} rounded-xl flex items-center justify-center cursor-pointer`}
              onClick = {() => {
                if (extraAction.id === 5) {setIsDeleteCard(true)}
                if (extraAction.id === 1) {handleHarvestClick(pondId)}
              }}
            >
              {extraAction.icon}
            </div>
          ))}
        </div>
      )}

      {isDeleteCard && (
        <DeleteCard 
          pondId={pondId} 
          setIsDeleteCard={setIsDeleteCard}
          onDeleteCardSuccess={onDeleteCardSuccess}
        />
      )}

      {isActiveModal && 
        <ActiveCard
          setIsActiveModal = {setIsActiveModal}
          onDeleteCardSuccess = {onPutSucces}
          pondId = {pondId}
        />}



    </div>
    </>
  );
}

export default Card;
