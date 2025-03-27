import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  ShoppingCart,
  Bell,
  Calendar,
  DollarSign,
  Home,
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
import axios from "axios";
const Dashboard = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [userData, setUserData] = useState({
    business_name: "",
    owner_name: "",
    phone_number: "",
    email: "",
    address: "",
    single_line_address: "",
    city: "",
    pincode: "",
    businessHours: {
      openingTime: "",
      closingTime: "",
      days: [],
    },
    category: [],
    discount: "",
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formDataRef = useRef({});

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname.split("/restaurant/")[1] || "";
    setActiveTab(path || "home");
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      let token = null;
      let id = null;
      const categories = ["restaurant", "shop", "activities"];

      for (const category of categories) {
        const storedToken = localStorage.getItem(`token_partner_${category}`);
        const storedId = localStorage.getItem(`id_partner_${category}`);
        if (storedToken && storedId) {
          token = storedToken;
          id = storedId;
          break;
        }
      }

      if (!token || !id) {
        navigation("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/auth/profile/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem("roleid", response.data.role_id);
        console.log("Fetched User Data:", response.data);
        setUserData(response.data);
        formDataRef.current = response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token_partner_restaurant");
    localStorage.removeItem("user");
    navigation("/login");
  };

  const handleProfileEdit = () => {
    setShowProfileMenu(false);
    setShowSettingsModal(true);
  };

  const ProfileSettingsModal = () => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;

      if (name.startsWith("businessHours.")) {
        const field = name.split(".")[1];
        formDataRef.current = {
          ...formDataRef.current,
          businessHours: {
            ...formDataRef.current.businessHours,
            [field]: value,
          },
        };
      } else {
        formDataRef.current = {
          ...formDataRef.current,
          [name]: type === "checkbox" ? checked : value,
        };
      }
    };

    const handleDaysChange = (event) => {
      const { value, checked } = event.target;
      formDataRef.current = {
        ...formDataRef.current,
        businessHours: {
          ...formDataRef.current.businessHours,
          days: checked
            ? [...formDataRef.current.businessHours.days, value]
            : formDataRef.current.businessHours.days.filter(
                (day) => day !== value
              ),
        },
      };
    };

    const handleCategoryChange = (event) => {
      const { value, checked } = event.target;
      formDataRef.current = {
        ...formDataRef.current,
        category: checked
          ? [...formDataRef.current.category, value]
          : formDataRef.current.category.filter((cat) => cat !== value),
      };
    };

    const handleSaveChanges = async () => {
      setIsLoading(true);
      let token = null;
      let id = null;
      const categories = ["restaurant", "shop", "activities"];

      for (const category of categories) {
        const storedToken = localStorage.getItem(`token_partner_${category}`);
        const storedId = localStorage.getItem(`id_partner_${category}`);
        if (storedToken && storedId) {
          token = storedToken;
          id = storedId;
          break;
        }
      }

      console.log("Token:", token, "ID:", id);

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/auth/${id}/`,
          formDataRef.current,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("response of updated user details:", response);

        if (response.status === 200) {
          toast.success("User details updated successfully!");
          setShowSettingsModal(false);
          setUserData(formDataRef.current);
        }
      } catch (error) {
        console.error("Error updating user details:", error);
        toast.error("Failed to update user details.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 mt-32 mb-32 p-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    defaultValue={userData.business_name}
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
                    defaultValue={userData.owner_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    defaultValue={userData.phone_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
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
                  defaultValue={userData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Single Line Address
                </label>
                <input
                  type="text"
                  name="single_line_address"
                  defaultValue={userData.single_line_address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={userData.city}
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
                    defaultValue={userData.pincode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Hours
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      name="businessHours.openingTime"
                      defaultValue={userData.businessHours.openingTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      name="businessHours.closingTime"
                      defaultValue={userData.businessHours.closingTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Days
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {daysOfWeek.map((day, index) => (
                    <div key={index}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="days"
                          value={day}
                          defaultChecked={userData.businessHours.days.includes(
                            day
                          )}
                          onChange={handleDaysChange}
                          className="mr-2"
                        />
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  defaultValue={userData.discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </form>

          <div className="flex justify-end gap-4 mt-6 border-t pt-4">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className={`px-3 py-1 text-white rounded-md flex items-center ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <React.Fragment>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </React.Fragment>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NavLink = ({ icon: Icon, label, value, path }) => (
    <button
      onClick={() => navigation(`/activity/${path}`)}
      className={`flex items-center w-full min-w-fit p-3 px-6 text-nowrap ${
        activeTab === value
          ? "border-r-2 bg-blue-50 border-blue-700 text-black"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon
        className={`w-5 h-5 mr-3 ${
          activeTab === value ? "text-blue-700" : "text-gray-700"
        } `}
      />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="py-3 px-4 bg-[#FF8749]">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4 relative">
            <div
              className="flex items-center space-x-2 px-3 py-2 text-md bg-white rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User className="w-4 h-4" />
              <span>{userData ? userData.business_name : "Loading..."}</span>
            </div>

            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-lg py-1 z-50 min-w-[12rem] max-w-md">
                <div className="px-4 py-2 text-sm text-gray-700 border-b break-words">
                  <p className="font-medium">{userData?.owner_name}</p>
                  <p className="text-xs text-gray-500 break-all">
                    {userData?.email}
                  </p>
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

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 mr-2 bg-white border-r shadow-sm">
          <nav className="space-y-2 p-4">
            <NavLink icon={Home} label="Home" value="home" path="" />
            <NavLink
              icon={ShoppingCart}
              label="Manage My Activities"
              value="listing"
              path="listing"
            />

            <NavLink
              icon={MessageSquare}
              label="Reviews"
              value="reviews"
              path="reviews"
            />
            <NavLink
              icon={DollarSign}
              label="Payments"
              value="payments"
              path="payments"
            />
          </nav>
        </div>
        <div className="flex-1 overflow-auto p-2">
          <Outlet />
        </div>
      </div>

      {showSettingsModal && <ProfileSettingsModal />}
    </div>
  );
};

export default Dashboard;
