import React, { useEffect, useState } from "react";
import HomeContent from "./components/HomeContent";
import DishManager from "./components/DishManager";
import BookingsManager from "./components/BookingDetails";
import {
    Bell,
  Calendar,
  DollarSign,
  Home,
  MessageSquare,
  Settings,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token_partner_shop");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [activeTab, setActiveTab] = useState("home");
  const [dishes, setDishes] = useState([
    { id: "01", name: "Dosa", price: "5", discount: "60", available: true,
      images: ["https://www.vegrecipesofindia.com/wp-content/uploads/201"],
      category: "Veg"
     },
    { id: "02", name: "Idly", price: "15", discount: "30", available: false,
      images: ["https://www.vegrecipesofindia.com/wp-content/uploads/201"],
      category: "Bestseller"
     },
  ]);

  const [bookings, setBookings] = useState([
    { id: "01", status: "New booking" },
    { id: "02", status: "Pending" },
  ]);

  const NavLink = ({ icon: Icon, label, value }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center w-full min-w-fit p-3 px-6 text-nowrap ${
        activeTab === value
          ? "border-r-2 bg-blue-50  border-blue-700 text-black"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${
        activeTab === value ? "text-blue-700" : "text-gray-700"
      } `} />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "dishes":
        return <DishManager dishes={dishes} setDishes={setDishes} />;
      // case "bookings":
      //   return (
      //     <BookingsManager bookings={bookings} setBookings={setBookings} />
      //   );
      default:
        return <></>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 py-3 px-4 bg-[#FF8749] ">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <Bell className="w-4 h-4 text-white" />
            <Settings className="w-4 h-4 text-white" />
            <div className="flex items-center space-x-2 px-2 py-1 text-md bg-white rounded-md">
              <span>{localStorage.getItem('username') || 'Guest'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-fit">
        <div className="w-fit p-4 bg-white border-r">
            <nav className="space-y-2">
            <NavLink icon={Home} label="Home" value="home" />
            <NavLink icon={Utensils} label="Manage Listing" value="dishes" />
            {/* <NavLink icon={Calendar} label="Manage Bookings" value="bookings" /> */}
            <NavLink icon={MessageSquare} label="Reviews" value="reviews" />
            <NavLink icon={DollarSign} label="Payments" value="payments" />
            </nav>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
