import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        password_confrimation: '',
    });
    const {setNotification} = useStateContext();

    if (id) {
        useEffect(() => {
            setLoading(true);

            axiosClient.get(`/users/${id}`)
            .then(({data}) => {
                setLoading(false);
                setUser(data);
            })
            .catch(() => {
                setLoading(false);
            })
        }, []) 
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                setNotification('User was successfully updated!');
                navigate('/users');
            })
            .catch(error => {
                const response = error.response;

                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        } else {
            axiosClient.post('/users', user)
            .then(() => {
                setNotification('User was successfully created!');
                navigate('/users');
            })
            .catch(error => {
                const response = error.response;

                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        }
    }

    return (
        <>
        {
            user.id ? (
                <h1>Update User: {user.name}</h1>
            ) : (
                <h1>New User</h1>
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

            <form action=""></form>
        </div>
        </>
    )
}