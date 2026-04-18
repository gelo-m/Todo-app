import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider";
import { format } from "date-fns";
import Pagination  from "../components/Pagination";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function List() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [counter, setCounter] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [list, setList] = useState({
        id: '',
        user_id: '',
        display_index: 0,
        description: '',
        detail: [],
    });
    const [listItem, setListItem] = useState([]);
    const [listDetail, setListDetail] = useState({
        id: '',
        list_id: '',
        display_index: 0,
        description: '',
        is_complete: false
    });

    const {user, notification, setUser, setNotification} = useStateContext();

    useEffect(() => {
        if (user?.id) {
            list.user_id = user.id;
            list.display_index = user.lists_count == 0 ? 0 : + 1;
        }
    }, [user]);

    useEffect(() => {
        if (id) {
            axiosClient.get('/lists', {
                params: { id }
            })
            .then(({data}) => {
                const head = data.data[0], detail = data.data[0].detail;

                setList(head);
                setListItem(detail);
            })
            .catch(() => {});
        }
    }, [id]);

    const handleChange = (e) => {
        const isChecked = e.target.checked;
        setIsChecked(isChecked);
    };

    const handleListSave = (e) => {
        e.preventDefault();
        if (! user.id) return;

        if (! list.id) {
            axiosClient.post('/lists', list)
            .then(({data}) => {
                setNotification('List was successfully created!');
                setErrors('');
                setList(data);
            })
            .catch(error => {
                const response = error.response;
    
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        } else {
            axiosClient.put(`/lists/${list.id}`, list)
            .then(() => {
                setNotification('Title was successfully updated!');
            })
            .catch(error => {
                const response = error.response;

                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        }
    }

    const onDelete = (id) => {
        axiosClient.delete(`/lists/${id}`)
        .then(() => {
            setNotification('List was successfully deleted!');
            navigate('/lists');
        })
    }

    const handleListDetailAdd = (e) => {
        e.preventDefault();
        if (! user.id && ! list.detail.length === 0) return;

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

        console.log(data);
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

    const handleCheckbox = (e) => {
        e.preventDefault();
        return true;
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                { ! list.id ? (<h1>Create new list</h1>) : (<h1>Update list</h1>)}
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div className="list-parent">
                                    <div className="list-item-description">
                                        <input type="text" className="list-description" placeholder="Enter title" value={list.description} onChange={e => setList({...list, description: e.target.value})} />
                                        <button className="btn-add btn-margin" onClick={handleListSave}>Save</button>
                                        { listItem.length < 1 && (<button className="btn-delete btn-margin" onClick={ev => onDelete(list.id)}>Delete</button>)}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listItem.map((items, index) => (
                                <tr key={index} draggable="true">
                                    <td>
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
                                                        }}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <input type="text" 
                                                    className={`list-description ${items.is_complete ? 'completed' : ''}`}
                                                    placeholder="Enter Title Item" 
                                                    value={items.description}
                                                    onChange={(e) => {
                                                        const updatedItems = [...listItem];
                                                        updatedItems[index].description = e.target.value;
                                                        setListItem(updatedItems);
                                                    }}
                                                />
                                                <button className="btn-add btn-margin" onClick={() => handleListDetailUpdate(items)}>Save</button>
                                                <button className="btn-delete btn-margin" onClick={() => handleListDetailRemove(items)}>Remove</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                )
                            )
                        }
                        {
                            list.id && (
                                <tr>
                                    <td>
                                        <div className="list-parent">
                                            <div className="list-item">
                                                <label className="container">
                                                    <span className="checkmark"></span>
                                                </label>
                                                <input type="text" className="list-description" placeholder="Enter Title Item" 
                                                    value={listDetail.description}
                                                    onChange={e => setListDetail({...listDetail, user_id: user.id, list_id: list.id, description: e.target.value, display_index: counter})} />
                                                <button className="btn-add btn-margin" onClick={handleListDetailAdd}>Add</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        } 
                    </tbody>
                </table>
            </div>
        </div>
    );
}