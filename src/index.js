import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginComponent from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Home/Home';
import DishManager from './pages/Home/components/DishManager';
import HomeContent from './pages/Home/components/HomeContent';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginComponent/>,
    },
    {
        path: '/signup',
        element: <SignUp/>,
    },
    {
        path: '/',
        element: <Dashboard/>,
        children: [
            {
                path: '',
                element: <HomeContent/>,
            },
            {
                path: 'dishes',
                element: <DishManager/>,
            },
            {
                path: 'reviews',
                element: <div>Reviews Component</div>,
            },
            {
                path: 'payments',
                element: <div>Payments Component</div>,
            },
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// reportWebVitals();