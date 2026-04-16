import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ListForm() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [list, setList] = useState({
        id: '',
        user_id: '',
        display_index: '',
        description: '',
    });
    const {user, notification, setUser, setNotification} = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true);

            axiosClient.get(`/lists/${id}`)
            .then(({data}) => {
                setLoading(false);
                setList(data);
                // console.log(user);
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
        if (user?.id) {
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
            .then(() => {
                setNotification('list was successfully created!');
                setErrors('');
            })
            .catch(error => {
                const response = error.response;

                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        }
    }

    const handleListDelete = (e) => {
        e.preventDefault();
    }

    const handleListItemSave = (e) => {
        e.preventDefault();
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
                    <input type="text" className="list-description" placeholder="Description" value={list.description} onChange={e => setList({...list, description: e.target.value})} />
                    <button className="btn-add btn-margin" onClick={handleListSave}>Save</button>
                    <button className="btn-delete btn-margin" onClick={handleListDelete}>Delete</button>
                    </div>
                    
                    
                </div>


                )
            }
            
            {/* {
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
                ! loading &&
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Name" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                    <input type="email" placeholder="Email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} />
                    <input type="password" placeholder="Password" onChange={e => setUser({...user, password: e.target.value})} />
                    <input type="password" placeholder="Password Confirmation" onChange={e => setUser({...user, password_confirmation: e.target.value})} />
                    <button className="btn-save btn-margin">Save</button>
                    <Link to={`/users`} className="btn-delete btn-margin">Cancel</Link>
                </form>
            }

            <form action=""></form> */}
        </div>
        </>
    )
}