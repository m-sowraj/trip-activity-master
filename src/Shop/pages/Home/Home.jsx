import React, { useEffect , useState } from "react"; 
import { useNavigate, NavLink as RouterNavLink, Outlet } from "react-router-dom";
import HomeContent from "./components/HomeContent";
import DishManager from "./components/DishManager";
import BookingsManager from "./components/BookingDetails";
import {
    Bell,
    Calendar,
    DollarSign,
    Home as HomeIcon,
    MessageSquare,
    Settings,
    Utensils,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token_partner_shop");
    if (!token) {
      navigate("/login");
    }
  }, []);

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

  const NavLink = ({ icon: Icon, label, to }) => {
    return (
      <RouterNavLink
        to={to}
        className={({ isActive }) => 
          isActive
            ? "flex items-center w-full min-w-fit p-3 px-6 text-nowrap border-r-2 bg-blue-50 border-blue-700 text-black"
            : "flex items-center w-full min-w-fit p-3 px-6 text-nowrap text-gray-700 hover:bg-gray-100"
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-700" : "text-gray-700"}`} />
            <span>{label}</span>
          </>
        )}
      </RouterNavLink>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-3 px-4 bg-[#FF8749]">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4">
            {/* <Bell className="w-4 h-4 text-white" />
            <Settings className="w-4 h-4 text-white" /> */}
            <div className="flex items-center space-x-2 px-2 py-1 text-md bg-white rounded-md">
              <span>{localStorage.getItem('username') || 'Guest'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-64 bg-white border-r shadow-sm">
          <nav className="sticky top-0 space-y-2 p-4">
            <NavLink icon={HomeIcon} label="Home" to="/shop/" />
            <NavLink icon={Utensils} label="Manage Listing" to="/shop/listing" />
            <NavLink icon={MessageSquare} label="Reviews" to="/shop/reviews" />
            <NavLink icon={DollarSign} label="Payments" to="/shop/payments" />
          </nav>
        </div>
        
        <div className="flex-1 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
