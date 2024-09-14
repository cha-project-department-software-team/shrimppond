import React, { useRef, useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { CiCirclePlus } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Card from '../Card/Card'; 
import { useSelector } from 'react-redux';

const PondSummary = ({ arrayTest, pondTypeName, isDeleteModal, setIsDeleteModal, onDelete }) => {  // Nhận thêm pondTypeName từ props
  const expanded = useSelector((state) => state.sidebar.expanded);
  const [dragging, setDragging] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const tabsBoxRef = useRef(null);

  const handleMouseMove = (e) => {
    const tabsBox = tabsBoxRef.current;
    if (tabsBox && dragging) {
      tabsBox.scrollLeft -= e.movementX;
    }
  };

  const handleScroll = () => {
    const tabsBox = tabsBoxRef.current;
    if (tabsBox) {
      const scrollWidth = tabsBox.scrollWidth - tabsBox.clientWidth;
      setShowLeftArrow(tabsBox.scrollLeft > 0);
      setShowRightArrow(tabsBox.scrollLeft < scrollWidth);
    }
  };

  const handleLeftArrowClick = () => {
    const tabsBox = tabsBoxRef.current;
    if (tabsBox) {
      tabsBox.scrollLeft -= 350;
    }
  };

  const handleRightArrowClick = () => {
    const tabsBox = tabsBoxRef.current;
    if (tabsBox) {
      tabsBox.scrollLeft += 350;
    }
  };

  useEffect(() => {
    const tabsBox = tabsBoxRef.current;
    if (tabsBox) {
      tabsBox.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (tabsBox) {
        tabsBox.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col w-[90%] h-[30%] bg-white rounded-xl pb-1 border mt-1 shadow-xl">
      <div className="flex text-3xl font-bold mb-1 justify-between p-1">
        {/* Thay thế tiêu đề "Ao ươm" bằng pondTypeName */}
        <h1>{pondTypeName}</h1>  
        <span className="flex gap-x-3 pr-5">
          <FaTrashAlt 
            className = "cursor-pointer"
            onClick={() => { setIsDeleteModal(true);
              onDelete(pondTypeName) // Gọi hàm onDelete khi nhấn nút xóa
            }}  
          />
          <CiCirclePlus 
            className="text-4xl cursor-pointer" 
          />
        </span>
      </div>

      <div className={`overflow-hidden no-scrollbar px-5 h-full relative ${expanded ? "max-w-5xl" : "max-w-full"}`}>
        {showLeftArrow && (
          <div className="absolute top-0 w-24 h-[70%] flex items-center left-0 z-10"
            style={{ background: 'linear-gradient(90deg, #fff 70%, transparent)' }}
            onClick={handleLeftArrowClick}
          >
            <FaAngleLeft className="w-9 h-9 p-1 bg-[#D8D5F2] text-center rounded-[50%] cursor-pointer ml-3 hover:bg-[#efedfb]" />
          </div>
        )}
        
        <div
          ref={tabsBoxRef}
          className={`tabs-box flex gap-x-1 h-full overflow-x-hidden no-scrollbar ${dragging ? "scroll-auto cursor-grab" : "scroll-smooth"}`}
          onMouseMove={handleMouseMove}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          <div className="flex gap-x-3 h-full">
            {arrayTest.map((res) => (
              <Card pondId={res.pondId} status={res.status} key={res.pondId} />
            ))}
          </div>
        </div>

        {showRightArrow && (
          <div className="absolute top-0 h-[70%] w-24 flex items-center right-0 justify-end"
            style={{ background: 'linear-gradient(-90deg, #fff 70%, transparent)' }}
            onClick={handleRightArrowClick}
          >
            <FaAngleRight className="w-9 h-9 p-1 bg-[#D8D5F2] text-center rounded-[50%] cursor-pointer mr-3" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PondSummary;
