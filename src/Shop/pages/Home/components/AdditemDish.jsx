import React, { useRef, useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import shopAxios from '../../../../utils/shopaxios';

const AddItemModal = ({ isOpen, onClose, onAddItem, editDish }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    image_url: '',
    images: []
  });

  useEffect(() => {
    if (editDish) {
      setFormData({
        name: editDish.name || '',
        description: editDish.description || '',
        price: editDish.price?.toString() || '',
        discounted_price: editDish.discounted_price?.toString() || '',
        image_url: editDish.image_url || '',
        images: editDish.images || []
      });
      const previewUrls = editDish.image_url ? [editDish.image_url] : [];
      setPreviewUrls(previewUrls);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        discounted_price: '',
        image_url: '',
        images: []
      });
      setPreviewUrls([]);
    }
  }, [editDish]);

  const fileInputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 85;
    const remainingSlots = maxFiles - (formData.images?.length || 0);
    const allowedFiles = files.slice(0, remainingSlots);

    const newPreviewUrls = allowedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...allowedFiles]
    }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        imageFiles.forEach(file => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
        handleImageChange({ target: { files: dataTransfer.files } });
      }
    }
  };

  const handleClose = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFormData(prev => ({ ...prev, images: [] }));
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestBody = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      discounted_price: Number(formData.discounted_price),
      image_url: formData.image_url,
      createdBy: localStorage.getItem('id_partner_shop'),
      is_active: true,
      is_deleted: false,
      location_id: localStorage.getItem('partner_shop_location_id')
    };

    try {
      const response = editDish 
        ? await shopAxios.put(`/products/${editDish._id}`, requestBody)
        : await shopAxios.post('/products', requestBody);

      onAddItem(response.data);
      handleClose();
      toast.success(editDish ? 'Product updated successfully' : 'Product added successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request');
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editDish ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discounted Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discounted_price}
                  onChange={(e) => setFormData({ ...formData, discounted_price: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold text-gray-700">Active</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.is_active ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images
                </label>
                <div
                    className="mt-1 flex flex-col justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                    />
                    <div className="text-center cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        ({formData.images.length}/85)
                    </div>
                    </div>
                </div>

                {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md"
                        />
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        </div>
                    ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                {editDish ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;