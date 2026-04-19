import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider";
import { format } from "date-fns";
import Pagination  from "../components/Pagination";
import  ListDetailData  from "./ListDetail";
import { IoCreateOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export default function List() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [list, setList] = useState({
        id: '',
        user_id: '',
        display_index: 0,
        description: '',
        detail: [],
    });

    const {user, notification, displayIndex, setUser, setNotification, setDisplayIndex} = useStateContext();

    useEffect(() => {
        if (user?.id) {
            list.user_id = user.id;
            list.display_index = displayIndex;
        }
    }, [user]);

    useEffect(() => {
        if (id) {
            axiosClient.get('/lists', {
                params: { id }
            })
            .then(({data}) => {
                const head = data.data[0];

                if (head) setList(head);
            })
            .catch(() => {});
        }
    }, [id]);

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
                                        <button className="btn-icon icon-green btn-margin" onClick={handleListSave}><IoCreateOutline/></button>
                                        {
                                            list.id && list.detail?.length < 1 && (
                                                <button className="btn-icon icon-delete btn-margin" onClick={ev => onDelete(list.id)}><MdDelete/></button>
                                            )
                                        }
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <ListDetailData data={list} user={user}></ListDetailData>
                    </tbody>
                </table>
            </div>
        </div>
    );
}