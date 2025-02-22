import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Bell,
    Calendar,
    DollarSign,
    Home,
    MessageSquare,
    Settings,
    Utensils,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname.split('/activity/')[1] || '';
    setActiveTab(path || 'home');
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token_partner_acti");
    const userInfo = localStorage.getItem("user");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const NavLink = ({ icon: Icon, label, value, path }) => (
    <button
      onClick={() => navigate(`/activity/${path}`)}
      className={`flex items-center w-full min-w-fit p-3 px-6 text-nowrap ${
        activeTab === value
          ? "border-r-2 bg-blue-50 border-blue-700 text-black"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${
        activeTab === value ? "text-blue-700" : "text-gray-700"
      } `} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="py-3 px-4 bg-[#FF8749]">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4">
            {/* <Bell className="w-4 h-4 text-white" />
            <Settings className="w-4 h-4 text-white" /> */}
            <div className="flex items-center space-x-2 px-2 py-1 text-md bg-white rounded-md">
              <span>{userData ? userData.name : 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 mr-2 bg-white border-r shadow-sm">
          <nav className="space-y-2 p-4">
            <NavLink icon={Home} label="Home" value="home" path="" />
            <NavLink icon={Utensils} label="Manage Listing" value="listing" path="listing" />
            <NavLink icon={Calendar} label="Manage Bookings" value="booking" path="booking" />
            <NavLink icon={MessageSquare} label="Reviews" value="reviews" path="reviews" />
            <NavLink icon={DollarSign} label="Payments" value="payments" path="payments" />
          </nav>
        </div>
        <div className="flex-1 overflow-auto p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
