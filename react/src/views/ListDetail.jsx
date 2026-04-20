import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";

// function useDebounce(value, delay) {
//     const [debouncedValue, setDebouncedValue] = useState(value);
  
//     useEffect(() => {
//       // Set a timer to update the debounced value after the delay
//       const handler = setTimeout(() => {
//         setDebouncedValue(value);
//       }, delay);
  
//       // Cleanup: cancel the timer if the value changes again before delay finishes
//       return () => clearTimeout(handler);
//     }, [value, delay]);
  
//     return debouncedValue;
// }

export default function ListDetailData({data, user}) {
    useEffect(() => {
        if (data) {
            setListItem(data.detail);
        }
    }, [data]);

    const {setNotification} = useStateContext();
    const [draggedIndex, setDraggedIndex] = useState(0);
    const [counter, setCounter] = useState(0);
    const [listItem, setListItem] = useState([]);
    const [listDetail, setListDetail] = useState({
        id: '',
        list_id: '',
        display_index: 0,
        description: '',
        is_complete: false,
    });
    const [isChecked, setIsChecked] = useState(false);
    const handleDrop = (targetIndex) => {
        const updated = [...listItem];
      
        const draggedItem = updated[draggedIndex];

        updated.splice(draggedIndex, 1);
      
        updated.splice(targetIndex, 0, draggedItem);
      
        const reordered = updated.map((item, index) => ({
          ...item,
          display_index: index
        }));
      
        setListItem(reordered);
        saveOrder(reordered);
    };

    const saveOrder = (items) => {
        axiosClient.patch('/list-detail-reorder', {
            items: items.map(data => ({
                id: data.id,
                list_id: data.list_id,
                display_index: data.display_index
            }))
        });
    };

    const handleListDetailAdd = (e) => {
        e.preventDefault();

        if (! user.id || ! data.id || listDetail.description == '') return;

        setListDetail({
            ...listDetail,
            is_complete: isChecked ? 1 : 0
        });

        axiosClient.post('/list-detail', listDetail)
        .then(({data}) => {
            // setErrors('');

            setNotification('Item was successfully created!');
            setListItem([...listItem, {...listDetail, id: data.id}]);
            setListDetail({ ...listDetail, description: ''});
            setCounter(counter + 1);

        })
        .catch(error => {
            const response = error.response;

            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        });
    }

    const handleListDetailUpdate = (item) => {
        if (! item.id) return;

        let data = item;
            data.is_complete ? 1 : 0;

        axiosClient.put(`/list-detail/${item.id}`, data)
            .then(() => {
                setNotification('Item updated!');
            });
    }

    const handleListDetailRemove = (data) => {
        axiosClient.delete(`/list-detail/${data.id}`)
        .then(() => {
            const updatedItems = listItem.filter(item => data.id !== item.id);
            setListItem(updatedItems);
            setNotification('Item was successfully deleted!');
        })
    }

    return (
        <>
            {
                listItem.length > 0 && listItem.map((items, index) => (
                    <tr key={index} 
                        draggable
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                    >
                        <td className="list-form">
                            <div className="list-parent">
                                <div className="list-item">
                                    <label className="container">
                                        <input
                                            type="checkbox"
                                            checked={items.is_complete}
                                            onChange={() => {
                                                const updatedItems = [...listItem];
                                                updatedItems[index].is_complete = ! updatedItems[index].is_complete;
                                                setListItem(updatedItems);
                                                handleListDetailUpdate(items);
                                            }}  
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <input type="text" 
                                        className={`list-description-item ${items.is_complete ? 'completed' : ''}`}
                                        placeholder="Enter Title Item" 
                                        value={items.description}
                                        onChange={(e) => {
                                            const updatedItems = [...listItem];
                                            updatedItems[index].description = e.target.value;
                                            setListItem(updatedItems);
                                        }}
                                    />
                                    <button className="btn-icon icon-green btn-margin" onClick={() => handleListDetailUpdate(items)}><IoCreateOutline/></button>
                                    <button className="btn-icon icon-delete btn-margin" onClick={() => handleListDetailRemove(items)}><MdDelete/></button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    )
                )
            }
            {
                data.id && (
                    <tr>
                        <td>
                            <div className="list-parent">
                                <div className="list-item">
                                    <label className="container">
                                        <span className="checkmark"></span>
                                    </label>
                                    <input
                                        type="text" className="list-description" placeholder="Enter item" 
                                        value={listDetail.description}
                                        onChange={e => setListDetail({...listDetail, user_id: user.id, list_id: data.id, description: e.target.value, display_index: counter})} />
                                    <button className="btn-icon icon-green btn-margin" onClick={handleListDetailAdd}><IoIosAddCircle/></button>
                                </div>
                            </div>
                        </td>
                    </tr>
                )
            } 
        </>
    )
}