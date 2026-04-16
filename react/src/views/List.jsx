import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import Pagination  from "../components/Pagination";

export default function List() {
    const [lists, setLists] = useState([]);
    const [searchDescription, setSearchDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const {user, notification, setNotification, setUser} = useStateContext();
    

    useEffect(() => {
        if (user?.id) {
            loadTableData();
        }
    }, [user]);

    const createdAt = (date) => {
        return format(new Date(date), "MM/dd/yyyy");
    }

    const onDelete = (u) => {
        if (! window.confirm("Are you sure you want to delete this list ?")) {
            return;
        }

        axiosClient.delete(`/lists/${u.id}`)
        .then(() => {
            setNotification('List item was successfully deleted!');
            loadTableData(currentPage);
        })
    }

    const loadTableData = (data) => {    
        let url = `/lists`;

        console.log(user);

        if (typeof data === 'object' && data !== null) {
            const page = tablePage(data);
            setCurrentPage(page);

            url = `/lists?page=${page}`;
        } else if (currentPage !== 1) {
            url = `/lists?page=${currentPage}`;
        }

        setLoading(true);
        axiosClient.get(url, {
            params: {
                user_id: user.id,
                description: searchDescription
            }
        })
        .then(({data}) => {
            setLoading(false);
            setLists(data.data);
            setPages(data.meta.links);
        }).catch(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Lists</h1>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search title ..."
                        onKeyDown={(e) => {
                            setSearchDescription(e.target.value)
                            if (e.key === 'Enter') {
                                loadTableData();
                            }
                          }} 
                    />
                    <Link to="/lists/new" className="btn-add">Create New</Link>
                    </div>
            </div>
            <div className="card animated fadeInDown">
                {
                    ! loading && (
                        <div className="text-center">Loading ...</div>
                    )
                }
            </div>
            {/* <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {
                        loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="text-center">Loading ...</td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {
                                    lists.map((u, index) => (
                                        <tr key={index}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{createdAt(u.created_at)}</td>
                                            <td>
                                                <Link to={`/lists/${u.id}`} className="btn-detail">View</Link>
                                                &nbsp;
                                                <Link to={`/lists/${u.id}`} className="btn-edit">Edit</Link>
                                                &nbsp;
                                                <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                                            </td>
                                        </tr>
                                    )) 
                                }
                            </tbody>
                        )
                    }
                </table>
                <Pagination data={pages} onTrigger={loadTableData}></Pagination>
            </div> */}
        </div>
    );
}
