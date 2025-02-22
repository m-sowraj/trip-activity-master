import React, { useRef, useState, useEffect } from "react";
import { X, Upload, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const AddItemModal = ({ isOpen, onClose, onAddItem, editDish }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discounted_price: "",
    image: "",
    is_active: true,
  });

  useEffect(() => {
    if (editDish) {
      setFormData({
        name: editDish.name,
        description: editDish.description,
        category: editDish.category,
        price: editDish.price,
        discounted_price: editDish.discounted_price,
        image: editDish.image,
        is_active: editDish.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        discounted_price: "",
        image: "",
        is_active: true,
      });
    }
  }, [editDish]);

  const fileInputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 85;
    const remainingSlots = maxFiles - formData.images.length;
    const allowedFiles = files.slice(0, remainingSlots);

    const newPreviewUrls = allowedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...allowedFiles],
    }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        imageFiles.forEach((file) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
        handleImageChange({ target: { files: dataTransfer.files } });
      }
    }
  };

  const handleClose = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFormData((prev) => ({ ...prev, images: [] }));
    onClose();
  };

  const categories = [
    "Veg",
    "Non-Veg",
    "Bestseller",
    "Spicy",
    "No onion or garlic",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncludedItemChange = (index, value) => {
    const newIncludedItems = [...formData.whatsincluded];
    newIncludedItems[index] = value;
    setFormData((prev) => ({
      ...prev,
      whatsincluded: newIncludedItems,
    }));
  };

  const addIncludedItem = () => {
    setFormData((prev) => ({
      ...prev,
      whatsincluded: [...prev.whatsincluded, ""],
    }));
  };

  const removeIncludedItem = (index) => {
    if (formData.whatsincluded.length > 1) {
      const newIncludedItems = formData.whatsincluded.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        whatsincluded: newIncludedItems,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();    
    const token = localStorage.getItem('token_partner_rest');

    if (editDish) {
      fetch(`https://fourtrip-server.onrender.com/api/dishes/${editDish._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price),
          discounted_price: Number(formData.discounted_price),
          image: formData.image,
          partner_id: "677b52a71333f6a77e3456c8",
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          onAddItem(data.data);
          handleClose();
          toast.success('Dish updated successfully');
        } else {
          toast.error('Error updating dish');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error updating dish');
      });
    } else {
      fetch('https://fourtrip-server.onrender.com/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price),
          discounted_price: Number(formData.discounted_price),
          image: formData.image,
          partner_id: "677b52a71333f6a77e3456c8",
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          onAddItem(data.data);
          handleClose();
          toast.success('Dish added successfully');
        } else {
          toast.error('Error adding dish');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error adding dish');
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editDish ? "Edit Dish" : "Add New Dish"}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discounted Price
                    </label>
                    <input
                      name="discounted_price"
                      type="number"
                      value={formData.discounted_price}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    name="image"
                    type="text"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter image URL"
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editDish ? "Update Dish" : "Add Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
