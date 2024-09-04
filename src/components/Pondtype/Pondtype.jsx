import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { arrayTest } from '../../utils/constants/index'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { arrayTest } from '../../utils/constants/index'

function Pondtype () {
    return (
        <>
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

                <div className="relative flex flex-col w-[90%] h-[30%] bg-white rounded-xl pb-1 border mt-1 shadow-xl">
                <div className="flex text-3xl font-bold mb-1 justify-between p-1">
                    <h1>Ao ươm</h1>
                    <span className="flex gap-x-3 pr-5">
                    <FaTrashAlt />
                    <CiCirclePlus className="text-4xl" />
                    </span>
                </div>

                <div className= {`overflow-hidden no-scrollbar px-5 h-full relative ${expanded ? "max-w-5xl" : "max-w-full"}`}>
                    {/* Mũi tên trái */}
                    {showLeftArrow && (
                    <div className="absolute top-0 w-24 h-[70%] flex items-center left-0 z-10"
                        style={{ background: 'linear-gradient(90deg, #fff 70%, transparent)' }}
                        onClick={() => {
                        const tabsBox = tabsBoxRef.current;
                        if (tabsBox) {
                            tabsBox.scrollLeft -= 350; // Di chuyển về phía trái
                        }
                        }}
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
                    <div 
                        className = "flex gap-x-3 h-full"
                    >
                        {arrayTest.map((res) => 
                            <Card pondId= {res.pondId} status = {res.status} key={res.pondId}/>
                        )}
                    </div>
                    </div>

                    {/* Mũi tên phải */}
                    {showRightArrow && (
                    <div className="absolute top-0 h-[70%] w-24 flex items-center right-0 justify-end"
                        style={{ background: 'linear-gradient(-90deg, #fff 70%, transparent)' }}
                        onClick={() => {
                        const tabsBox = tabsBoxRef.current;
                        if (tabsBox) {
                            tabsBox.scrollLeft += 350; // Di chuyển về phía phải
                        }
                        }}
                    >
                        <FaAngleRight className="w-9 h-9 p-1 bg-[#D8D5F2] text-center rounded-[50%] cursor-pointer mr-3" />
                    </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Pondtype