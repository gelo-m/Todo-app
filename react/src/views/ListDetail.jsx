import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ListForm() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [parentId, setParentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [list, setList] = useState({
        id: '',
        user_id: '',
        display_index: 0,
        description: '',
        detail: []
    });
    const [listDetail, setListDetail] = useState({
        id: '',
        list_id: '',
        display_index: 0,
        description: '',
        is_complete: false,
    });
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

    const handleListSave = (e) => {
        e.preventDefault();
        if (! user.id) return;
        //     axiosClient.put(`/users/${user.id}`, user)
        //     .then(() => {
        //         setNotification('User was successfully updated!');
        //         navigate('/users');
        //     })
        //     .catch(error => {
        //         const response = error.response;

        //         if (response && response.status === 422) {
        //             setErrors(response.data.errors);
        //         }
        //     });
        // } else {
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

        let listDetailData = listDetail;
            listDetailData.list_id = list.id;
            listDetailData.is_complete = listDetail.is_complete ? 1 : 0;

            console.log(listDetail);

        axiosClient.post('/list-detail', listDetailData)
        .then(({data}) => {
            setNotification('Item was successfully created!');
            setErrors('');
            list.detail.push(data);
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

    return (
        <>
        {
            list.id ? (
                <h1>Update List: {list.description}</h1>
            ) : (
                <h1>Create new list</h1>
            )
        }
        <div className="card animated fadeInDown">

            {
                loading && (
                    <div className="text-center">Loading...</div>   
                )
            }

            {
                errors && <div className="alert">
                    {
                        Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))
                    }
                </div>
            }
            {
                ! loading && (
                <div className="list-parent">
                    <div className="list-item">
                        <input type="text" className="list-description" placeholder="Enter Title" value={list.description} onChange={e => setList({...list, description: e.target.value})} />
                        <button className="btn-add btn-margin" onClick={handleListSave}>Save</button>
                        <button className="btn-delete btn-margin" onClick={handleListDelete}>Delete</button>
                    </div>

                    {
                        list.detail.length > 0 && (
                            list.detail.map((item, index) => {
                                <div className="list-item detail" key={index}>
                                    <div class="list-detail-item">{item.description}</div>
                                </div>
                            })                    
                        )
                    }

                    <div className="list-item detail">
                        <input type="text" className="list-description" placeholder="Enter Title Item" value={listDetail.description} onChange={e => setListDetail({...listDetail, description: e.target.value})} />
                        <button className="btn-add btn-margin" onClick={handleListDetailAdd}>Add</button>
                    </div>
                    
                </div>


                )
            }
        </div>
        </>
    )
}