import cl from 'classnames';
import { useState, useRef, useEffect } from "react";
// import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';

function Dropdown({ items, buttonLabel, width = 192, height = 192, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(buttonLabel);
    const scrollRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleScroll = (e) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop += e.deltaY;
        }
    };

    const handleItemClick = (item) => {
        setIsOpen(false);
        setSelectedItem(item.name);
        onChange(item.name);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            style={{ width: `${width}px` }}
            className="relative flex flex-col items-center rounded-lg overflow-hidden"
        >
            <select
                onClick={() => setIsOpen((prev) => !prev)}
                className={cl(
                    "bg-white shadow-xl p-1 w-full flex items-center justify-between font-bold text-lg",
                    "rounded-lg tracking-wider border-3 border-transparent",
                    "active:border-black duration-300"
                )}
            >
                {selectedItem}
                {/* {!isOpen ? (
                    <AiOutlineCaretDown className="h-8" />
                ) : (
                    <AiOutlineCaretUp className="h-8" />
                )} */}
                {items.map((item, i) => (
                        <option
                            key={i}
                            onClick={() => handleItemClick(item)}
                            className={cl(
                                "flex w-full hover:bg-gray-300 cursor-pointer",
                                "border-l-transparent hover:border-l-white border-l-4 p-1"
                            )}
                            value = {item.name}
                        >
                            {item.name}
                        </option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;
