import cl from 'classnames';
import { useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';

function Dropdown({ items, buttonLabel }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex flex-col items-center w-80 h-80 rounded-lg">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={cl(
                    "bg-blue-300 p-4 w-full flex items-center justify-between font-bold text-lg",
                    "rounded-lg tracking-wider border-4 border-transparent",
                    "active:border-black duration-300"
                )}
            >
                {buttonLabel}
                {!isOpen ? (
                    <AiOutlineCaretDown className="h-8" />
                ) : (
                    <AiOutlineCaretUp className="h-8" />
                )}
            </button>

            {isOpen && (
                <div className="absolute bg-blue-300 top-20 flex flex-col items-start rounded-lg p-2 w-full">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={cl(
                                "flex w-full hover:bg-gray-100 cursor-pointer rounded-r-lg",
                                "border-l-transparent hover:border-l-white border-l-4 p-1"
                            )}
                        >
                            <h3 className="font-bold">{item.name}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
