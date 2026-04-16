import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { format } from "date-fns";
import Pagination  from "../components/Pagination";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const {setNotification} = useStateContext();
    

    useEffect(() => {
        loadTableData();
    }, []);

    const createdAt = (date) => {
        return format(new Date(date), "MM/dd/yyyy");
    }

    const onDelete = (u) => {
        if (! window.confirm("Are you sure you want to delete this user ?")) {
            return;
        }

        axiosClient.delete(`/users/${u.id}`)
        .then(() => {
            setNotification('User was successfully deleted!');
            loadTableData(currentPage);
        })
    }

    const loadTableData = (data) => {    
        let url = `/users`;

        if (typeof data === 'object' && data !== null) {
            const page = tablePage(data);
            setCurrentPage(page);

            url = `/users?page=${page}`;
        } else if (currentPage !== 1) {
            url = `/users?page=${currentPage}`;
        }

        setLoading(true);
        axiosClient.get(url, {
            params: {
                keyword: searchKeyword
            }
        })
        .then(({data}) => {
            setLoading(false);
            setUsers(data.data);
            setPages(data.meta.links);
        }).catch(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search user"
                        onKeyDown={(e) => {
                            setSearchKeyword(e.target.value)
                            if (e.key === 'Enter') {
                                loadTableData();
                            }
                          }} 
                    />
                    <Link to="/users/new" className="btn-add">Add new</Link>
                    </div>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
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
                                    users.map((u, index) => (
                                        <tr key={index}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{createdAt(u.created_at)}</td>
                                            <td>
                                                <Link to={`/users/${u.id}`} className="btn-detail">View</Link>
                                                &nbsp;
                                                <Link to={`/users/${u.id}`} className="btn-edit">Edit</Link>
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
            </div>
        </div>
    );
}

function tablePage(data) {
    const urlString = data.url;
    const position = parseInt(urlString.search("page=")) + 5;
    const page = urlString.substring(position);

    return page;
}
