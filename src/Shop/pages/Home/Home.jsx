import React, { useEffect, useState } from "react"; 
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
    LogOut,
    User,
    X,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token_partner_shop");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const id = localStorage.getItem("id_partner_shop");
        const response = await fetch(`https://fourtrip-server.onrender.com/api/commonauth/user/${id}`);
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData({
        business_name: userData.business_name || '',
        owner_name: userData.owner_name || '',
        phone_number: userData.phone_number || '',
        email: userData.email || '',
        address: userData.address || '',
        city: userData.city || '',
        pincode: userData.pincode || ''
      });
    }
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("token_partner_shop");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileEdit = () => {
    setShowProfileMenu(false);
    setShowSettingsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const id = localStorage.getItem("id_partner_shop");
      const response = await fetch(`https://fourtrip-server.onrender.com/api/commonauth/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_partner_shop')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUserData(data.data);
      setShowSettingsModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ProfileSettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <button 
            onClick={() => setShowSettingsModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input 
                type="text" 
                name="business_name"
                value={formData.business_name || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name
              </label>
              <input 
                type="text" 
                name="owner_name"
                value={formData.owner_name || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </div>
              </label>
              <div className="relative">
                <input 
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  readOnly
                  className="w-full p-2 border rounded-md bg-gray-50 cursor-not-allowed filter blur-[0.5px]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-20 rounded-md">
                  {/* <span className="text-sm text-gray-500">Contact support to change</span> */}
                </div>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <div className="relative">
                <input 
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  readOnly
                  className="w-full p-2 border rounded-md bg-gray-50 cursor-not-allowed filter blur-[0.5px]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-20 rounded-md">
                  {/* <span className="text-sm text-gray-500">Contact support to change</span> */}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </div>
            </label>
            <textarea 
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input 
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <input 
                type="text"
                name="pincode"
                value={formData.pincode || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md flex items-center ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

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
          <div className="flex items-center space-x-4 relative">
            <div 
              className="flex items-center space-x-2 px-3 py-2 text-md bg-white rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User className="w-4 h-4" />
              <span>{userData ? userData.business_name : 'Loading...'}</span>
            </div>

            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-lg py-1 z-50 min-w-[12rem] max-w-md">
                <div className="px-4 py-2 text-sm text-gray-700 border-b break-words">
                  <p className="font-medium">{userData?.owner_name}</p>
                  <p className="text-xs text-gray-500 break-all">{userData?.email}</p>
                </div>
                <button
                  onClick={handleProfileEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
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

      {showSettingsModal && <ProfileSettingsModal />}
    </div>
  );
};

export default Dashboard;
