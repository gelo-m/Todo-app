import { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function DefaultLayout() {
    const {user, token, notification, setUser, setToken, setNotification} = useStateContext();
    const onLogout = (event) => {
        event.preventDefault();

        axiosClient.post('/logout')
        .then(() => {
            setUser({});
            setToken(null);
        })
    }

    if (! token) {
        return <Navigate to="/login"/>
    }

    useEffect(() => {
        axiosClient.get('/user')
        .then(({data}) => {
            setUser(data);
        })
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                {/* <Link to="/dashboard">Dashboard</Link> */}
                {/* <Link to="/users">Users</Link> */}
                <Link to="/lists">My todo lists</Link>
            </aside>
            <div className="content">
                <header>
                    <div>Todo App</div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
            {notification && <div className="notification">{notification}</div>}
        </div>
    )
}