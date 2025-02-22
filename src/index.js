import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginComponent from './Shop/pages/Login/Login';
import SignUp from './Shop/pages/SignUp/SignUp';
import Dashboard from './Shop/pages/Home/Home';
import DishManager from './Shop/pages/Home/components/DishManager';
import HomeContent from './Shop/pages/Home/components/HomeContent';
import ActivityDashboard from './Activity/pages/Home/Home';
import ActivityDishManager from './Activity/pages/Home/components/DishManager';
import ActivityHomeContent from './Activity/pages/Home/components/HomeContent';
import ActivityBooking from './Activity/pages/Home/components/BookingDetails';
import RestaurantDashboard from './Restaurants/pages/Home/Home';
import RestaurantDishManager from './Restaurants/pages/Home/components/DishManager';
import RestaurantHomeContent from './Restaurants/pages/Home/components/HomeContent';
import RestaurantBooking from './Restaurants/pages/Home/components/BookingDetails';

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
        path: '/shop',
        element: <Dashboard/>,
        children: [
            {
                path: '',
                element: <HomeContent/>,
            },
            {
                path: 'listing',
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
    },
    {
        path: '/activity',
        element: <ActivityDashboard/>,
        children: [
            {
                path: '',
                element: <ActivityHomeContent/>,
            },
            {
                path: 'listing',
                element: <ActivityDishManager/>,
            },
            {
                path: 'booking',
                element: <ActivityBooking/>,
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
    },
    {
        path: '/restaurant',
        element: <RestaurantDashboard/>,
        children: [
            {
                path: '',
                element: <RestaurantHomeContent/>,
            },
            {
                path: 'listing',
                element: <RestaurantDishManager/>,
            },
            {
                path: 'booking',
                element: <RestaurantBooking/>,
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

