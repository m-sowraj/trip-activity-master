import React, { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { toast, ToastContainer } from "react-toastify";

const PartnerRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Restaurant",
    address: "",
    password: "",
    confirmPassword: "",
    shop: "Souvenir and Gift Shops",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (
        !formData.businessName ||
        !formData.ownerName ||
        !formData.email ||
        !formData.phone ||
        !formData.category ||
        !formData.address ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.shop
      ) {
        alert("Please fill all the fields");
        return;
      }
    }
    console.log(formData);
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and Confirm Password should be same");
      return;
    }
    fetch('https://fourtrip-server.onrender.com/api/commonauth/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          business_name: formData.businessName,
          owner_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password,
          reg_type: 'partner',
          select_category: "shop",
          isActive: false,
          isNew: true,
          shopType: formData.category,
      }),
    })
    .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            if (data.status === 200) {
              toast.success('Sign up successful');
              navigate('/login');
            }
            else {
              toast.error('Sign up failed');
            }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        });
  };

  const renderBasicDetails = () => (
    <div className="space-y-2 ">
      <ToastContainer />
      <h1 className='my-2 pb-4 text-3xl w-full text-start font-medium'>Registration Form</h1>
      <div>
        <label className="block text-sm mb-1">Business Name</label>
        <input
          type="text"
          name="businessName"
          placeholder="Enter your restaurant name"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.businessName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Owner Name</label>
        <input
          type="text"
          name="ownerName"
          placeholder="Enter your owner name"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.ownerName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your Email address"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Phone number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your Phone number"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm mb-1">Type of Shop</label>
        <select
          name="shop"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.shop}
          onChange={handleInputChange}
        >
          <option value="Restaurant">Restaurant</option>
          <option value="Cafe">Cafe</option>
          <option value="FastFood">Fast Food</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Select Category</label>
        <select
          name="category"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="Souvenir and Gift Shops">Souvenir and Gift Shops</option>
          <option value="Clothing and Accessories Stores">Clothing and Accessories Stores</option>
          <option value="Handicraft and Artisan Stores">Handicraft and Artisan Stores</option>
          <option value="Food and Specialty Stores">Food and Specialty Stores</option>
          <option value="Antique and Curio Shops">Antique and Curio Shops</option>
          <option value="Cultural and Music Stores">Cultural and Music Stores</option>
          <option value="Health and Wellness Stores">Health and Wellness Stores</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          className="w-full px-4 py-1 text-sm rounded bg-orange-50"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-sm mb-1">Create password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full px-4 py-1 rounded bg-orange-50 pr-10"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full px-4 py-1 rounded bg-orange-50 pr-10"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="min-h-fit bg-white p-4 rounded-xl">
        <div className="max-w-md mx-auto">
          {currentStep === 1 && renderBasicDetails()}
          
          <button
            onClick={handleContinue}
            className="w-full bg-emerald-400 text-white rounded py-2 mt-6 hover:bg-emerald-500"
          >
            Join as a Partner
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Have an account already?{" "}
            <div onClick={()=>{navigate('/login')}} className="text-emerald-400">
              Login
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistration;
