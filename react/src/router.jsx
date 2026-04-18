import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuesstLayout from "./components/GuestLayout.jsx";
import NotFound from "./views/NotFound.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Dashboard from "./views/Dashboard.jsx";
import User from "./views/User.jsx";
import UserForm from "./views/UserForm";
import List from "./views/List.jsx";
import ListForm from "./views/ListForm.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/lists" />
            },
            {
                path: '/dashboard',
                element: <Dashboard/>   
            },
            {
                path: '/users',
                element: <User/>   
            },
            {
                path: '/users/new',
                element: <UserForm key="UserCreate"/>   
            },
            {
                path: '/users/:id',
                element: <UserForm key="UserUpdate"/>   
            },
            {
                path: '/lists',
                element: <List/>   
            },
            {
                path: 'lists/new',
                element: <ListForm/>
            },
            {
                path: '/lists/:id',
                element: <ListForm key="ListUpdate"/>   
            },
            {
                path: '/lists-detail/:id',
                element: <ListForm key="ListDetailUpdate"/>   
            },
        ] 
    },

    {
        path: '/',
        element: <GuesstLayout/>,
        children: [
            {
                path: '/login',
                element: <Login/>   
            },
            {
                path: '/signup',
                element: <Signup/>   
            },
        ] 
    },
    
    {
        path: '*',
        element: <NotFound/>   
    },
]);

export default router;