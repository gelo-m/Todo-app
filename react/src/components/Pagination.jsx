export default function Pagination({data, onTrigger}) {
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
            <ul className="pagination">
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
            </ul>
        </>
    )
}