import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { format } from "date-fns";
import Pagination  from "../components/Pagination";
import { set } from "lodash";

export default function List() {
    const [lists, setLists] = useState([]);
    const [searchDescription, setSearchDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [showPagination, setShowPagination] = useState(false);
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

            setShowPagination(data.meta.total > data.meta.per_page ? true : false);
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
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th style={{textAlign: 'right'}}>Date</th>
                            <th colSpan={2} style={{textAlign: 'right'}}>Acton</th>
                        </tr>
                    </thead>
                    {
                        loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="3" className="text-center">Loading ...</td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {
                                    lists.map((item, index) => (
                                        <tr key={index} draggable="true">
                                            <td>{item.description}</td>
                                            <td style={{textAlign: 'right'}}>{createdAt(item.created_at)}</td>
                                            <td style={{textAlign: 'right'}}>
                                                <Link to={`/lists/${item.id}`} className="btn-save">View</Link>
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
                {
                    showPagination && (<Pagination data={pages} onTrigger={loadTableData}></Pagination>)
                }
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
