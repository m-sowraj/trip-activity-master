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
    category: "restaurant",
    address: "",
    city: "",
    pincode: "",
    password: "",
    confirmPassword: "",
    businessHours: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    openingTime: "",
    closingTime: "",
    images: []
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

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: !prev.businessHours[day]
      }
    }));
  };

  const handleImageUpload = (files) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...Array.from(files)]
    }));
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!formData.businessName || !formData.ownerName || !formData.email || 
          !formData.phone || !formData.category || !formData.address || 
          !formData.city || !formData.pincode) {
        toast.error("Please fill all the fields");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // You might want to add validation for images and business hours here
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      // Submit form
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Your API call here
    fetch('https://fourtrip-server.onrender.com/api/commonauth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        reg_type: 'partner',
        select_category: formData.category,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        isActive: false,
        isNew: true,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        toast.success('Registration successful');
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      if (error.response && error.response.status == 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepOne = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Business Name</label>
        <input
          type="text"
          name="businessName"
          placeholder="Enter your business name"
          className="w-full px-4 py-2 rounded bg-orange-50"
          value={formData.businessName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Owner Name</label>
        <input
          type="text"
          name="ownerName"
          placeholder="Enter owner name"
          className="w-full px-4 py-2 rounded bg-orange-50"
          value={formData.ownerName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          className="w-full px-4 py-2 rounded bg-orange-50"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          className="w-full px-4 py-2 rounded bg-orange-50"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Category</label>
        <select
          name="category"
          className="w-full px-4 py-2 rounded bg-orange-50"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="restaurant">Restaurant</option>
          <option value="shop">Shop</option>
          <option value="activities">Activities</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter your address"
          className="w-full px-4 py-2 rounded bg-orange-50"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            className="w-full px-4 py-2 rounded bg-orange-50"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pin Code</label>
          <input
            type="text"
            name="pincode"
            placeholder="Enter pin code"
            className="w-full px-4 py-2 rounded bg-orange-50"
            value={formData.pincode}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Upload Restaurant Images</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            className="hidden"
            id="imageUpload"
            onChange={(e) => handleImageUpload(e.target.files)}
            accept="image/*"
          />
          <label 
            htmlFor="imageUpload" 
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload images</span>
            <span className="text-xs text-gray-400 mt-1">You can select multiple images</span>
          </label>
        </div>

        {/* Preview uploaded images */}
        {formData.images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Images ({formData.images.length})</h4>
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 
                             opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Business Hours</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Object.keys(formData.businessHours).map((day) => (
            <button
              key={day}
              className={`p-2 rounded ${formData.businessHours[day] ? 'bg-emerald-400 text-white' : 'bg-gray-200'}`}
              onClick={() => handleDayToggle(day)}
            >
              {day.slice(0,3)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Opening Time</label>
            <input
              type="time"
              name="openingTime"
              className="w-full px-4 py-2 rounded bg-orange-50"
              value={formData.openingTime}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Closing Time</label>
            <input
              type="time"
              name="closingTime"
              className="w-full px-4 py-2 rounded bg-orange-50"
              value={formData.closingTime}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Create Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="w-full px-4 py-2 rounded bg-orange-50 pr-10"
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
            className="w-full px-4 py-2 rounded bg-orange-50 pr-10"
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
  );

  return (
    <div className="min-h-fit bg-white p-6 rounded-xl">
      <ProgressBar currentStep={currentStep} />
      <div className="max-w-md mx-auto mt-6">
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
        
        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="w-full bg-gray-200 text-gray-700 rounded py-2 hover:bg-gray-300"
            >
              Back
            </button>
          )}
          <button
            onClick={handleContinue}
            className="w-full bg-emerald-400 text-white rounded py-2 hover:bg-emerald-500"
          >
            {currentStep === 3 ? "Join as a Partner" : "Continue"}
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          Have an account already?{" "}
          <span 
            onClick={() => navigate('/login')} 
            className="text-emerald-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PartnerRegistration;
