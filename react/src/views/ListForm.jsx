import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider";
import { format } from "date-fns";
import Pagination  from "../components/Pagination"; 

export default function List() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [counter, setCounter] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [listItem, setListItem] = useState([]);

    const initialState = {
        id: '',
        list_id: '',
        display_index: 0,
        description: '',
        is_complete: false,
    }

    const [list, setList] = useState({
        id: '',
        user_id: '',
        display_index: 0,
        description: '',
        detail: []
    });
    const [listDetail, setListDetail] = useState(initialState);
    const {user, notification, setUser, setNotification} = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true);

            axiosClient.get(`/lists/${id}`)
            .then(({data}) => {
                setLoading(false);
                setList(data);
            })
            .catch(() => {
                setLoading(false);
            })   

            
        }, [user]) 
    } else {
        useEffect(() => {
            if (user?.id) {
                list.user_id = user.id;
                list.display_index = user.lists_count == 0 ? 0 : + 1;
            }
        }, [user]) 
    }

    const handleChange = (e) => {
        const isChecked = e.target.checked;
        setIsChecked(isChecked);
    };

    const handleListSave = (e) => {
        e.preventDefault();
        if (! user.id) return;
        axiosClient.post('/lists', list)
        .then(({data}) => {
            setNotification('list was successfully created!');
            setErrors('');
            setList(data);
        })
        .catch(error => {
            const response = error.response;

            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        });
    }

    const handleListDelete = (e) => {
        e.preventDefault();
    }

    const handleListDetailAdd = (e) => {
        e.preventDefault();
        if (! user.id && ! list.detail.length === 0) return;

        let listDetailData = {... listDetail};
            listDetailData.list_id = list.id;
            listDetailData.display_index = counter;
            listDetailData.is_complete = isChecked ? 1 : 0;

        // console.log(listDetailData);

        axiosClient.post('/list-detail', listDetailData)
        .then(({data}) => {
            setNotification('Item was successfully created!');
            setErrors('');
            setListItem([...listItem, {...listDetailData}]);
            setCounter(counter + 1);
            setListDetail({... initialState});
        })
        .catch(error => {
            const response = error.response;

            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        });
    }

    const handleListItemDelete = (e) => {
        e.preventDefault();
    }

    const handleCheckbox = (e) => {
        e.preventDefault();
        return true;
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Create new list</h1>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div className="list-parent">
                                    <div className="list-item">
                                        <input type="text" className="list-description" placeholder="Enter title" value={list.description} onChange={e => setList({...list, description: e.target.value})} />
                                        <button className="btn-add btn-margin" onClick={handleListSave}>Save</button>
                                        { list.mode === 'view' && (<button className="btn-delete btn-margin" onClick={handleListDelete}>Delete</button>)}
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
                                                        <input type="checkbox"
                                                            checked={isChecked}
                                                            onChange={handleChange}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <input type="text" className="list-description" placeholder="Enter Title Item" value={items.description} onChange={e => setListDetail({...items, description: e.target.value})} />
                                                    <button className="btn-delete btn-margin" onClick={handleListDetailAdd}>Remove</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>)
                            )}
                            <tr>
                                <td>
                                    <div className="list-parent">
                                        <div className="list-item">
                                            <label className="container">
                                                <input type="checkbox"
                                                    checked={isChecked}
                                                    onChange={handleChange}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <input type="text" className="list-description" placeholder="Enter Title Item" value={listDetail.description} onChange={e => setListDetail({...listDetail, description: e.target.value})} />
                                            <button className="btn-add btn-margin" onClick={handleListDetailAdd}>Add</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </div>
        </div>
    );
}