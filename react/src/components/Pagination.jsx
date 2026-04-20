import { useState } from "react";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

export default function Pagination({data, onTrigger, lastPage, isLoading}) {
    const [currentPage, setCurrentPage] = useState(1);

    const goToNextPage = () => {
        if (currentPage === lastPage) return;
        onTrigger(Number(currentPage) + 1);
        setCurrentPage(Number(currentPage) + 1);
    }

    const goToPrevPage = () => {
        if (currentPage === 1) return;
        onTrigger(Number(currentPage) - 1);
        setCurrentPage(Number(currentPage) - 1);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const inputPage = Number(event.target.value);

            if (inputPage > lastPage || inputPage < 1) {
                setCurrentPage(1);  
                return;
            }

            onTrigger(inputPage);
        }
    };

    const setLabel = (data) => {
        if (data.label.includes("&laquo;")) {
            return "Prev";
        } else if (data.label.includes("&raquo;")) {
            return "Next";
        } else {
            return data.label;
        }
    }

    return (
        <>
        <ul className={isLoading ? 'hide-pagination' : 'pagination'}>
            <li className="pagination-item-arrow">
                <button className={`btn-icon icon-green ${isLoading ? 'icon-disabled' : ''}`} disabled={isLoading} onClick={goToPrevPage}><FaArrowAltCircleLeft /></button>
            </li>
            <li className="pagination-input-number">
                <input type="number" value={currentPage}
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    onChange={e => setCurrentPage(e.target.value)}
                /></li>
            <li className="last-page"><span>/ {lastPage}</span></li>
            <li className="pagination-item-arrow">
                <button className={`btn-icon icon-green ${isLoading ? 'icon-disabled' : ''}`} disabled={isLoading} onClick={goToNextPage}><FaArrowAltCircleRight /></button>
            </li>
        </ul>
            
            {/* <ul className="pagination">
                {
                    data.map((data, index) => (
                        data.url && 
                        <li 
                            key={index} 
                            className={data.active ? 'pagination-item active' : 'pagination-item'} 
                            onClick={ev => onTrigger(data)}
                        >
                            {setLabel(data)}
                        </li>
                    ))
                }
            </ul> */}
        </>
    )
}