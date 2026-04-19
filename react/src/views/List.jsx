import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { format } from "date-fns";
import Pagination  from "../components/Pagination";
import { IoCreateOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { update } from "lodash";

export default function List() {
    const [draggedIndex, setDraggedIndex] = useState(0);
    const [lists, setLists] = useState([]);
    const [searchDescription, setSearchDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [showPagination, setShowPagination] = useState(false);
    const { user, notification, displayIndex, setUser, setNotification, setDisplayIndex } = useStateContext();

    useEffect(() => {
        if (user?.id) {
            loadTableData();
        }
    }, [user]);

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
            setDisplayIndex(data.meta.total);

            setShowPagination(data.meta.total > data.meta.per_page ? true : false);
        }).catch(() => {
            setLoading(false);
        });
    }

    const handleDrop = (targetIndex) => {
        const updated = [...lists];
      
        const draggedItem = updated[draggedIndex];

        updated.splice(draggedIndex, 1);
      
        updated.splice(targetIndex, 0, draggedItem);
      
        const reordered = updated.map((item, index) => ({
          ...item,
          display_index: index
        }));
      
        setLists(reordered);
        saveOrder(reordered);
    };

    const saveOrder = (items) => {
        axiosClient.patch('/lists-reorder', {
            items: items.map(data => ({
                id: data.id,
                display_index: data.display_index
            }))
        });
    };

    const createdAt = (date) => {
        return format(new Date(date), "MM/dd/yyyy");
    }

    const onDelete = (id) => {
        axiosClient.delete(`/lists/${id}`)
        .then(() => {
            setNotification('List item was successfully deleted!');
            loadTableData(currentPage);
        })
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>My Todo List</h1>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search title ..."
                        onKeyUp={(e) => {
                            setSearchDescription(e.target.value)
                            if (e.key === 'Enter') {
                                loadTableData();
                            }
                          }} 
                    />
                    <Link to="/lists/new" className="btn-icon icon-add icon-green"><IoCreateOutline /></Link>
                    </div>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        {
                            lists.length > 0 ? (
                                <tr>
                                    <th>Title</th>
                                    <th style={{textAlign: 'right'}}>Date</th>
                                    <th colSpan={2} style={{textAlign: 'right'}}>Acton</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th colSpan={3}>No list yet, Create your first list !</th>
                                </tr>
                            )
                        }
                        
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
                                        <tr className="list"
                                            key={index}
                                            draggable
                                            onDragStart={() => setDraggedIndex(index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleDrop(index)}
                                        >
                                            <td>{item.description}</td>
                                            <td style={{textAlign: 'right'}}>{createdAt(item.created_at)}</td>
                                            <td style={{textAlign: 'right'}}>
                                                <Link to={`/lists/${item.id}`} className="btn-icon icon-orange"><FiEdit /></Link>
                                                &nbsp;
                                                <button onClick={ev => onDelete(item.id)} className="btn-icon icon-delete"><MdDelete /></button>
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
