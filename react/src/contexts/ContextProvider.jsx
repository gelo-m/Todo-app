import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    displayIndex: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    setDisplayIndex: () => {}
})

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [displayIndex, setDisplayIndex] = useState(0);
    const [notification, _setNotification] = useState('');
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('');
        }, 5000);
    } 

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else { 
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            notification,
            displayIndex,
            setUser,
            setToken,
            setNotification,
            setDisplayIndex
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)