import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AddItemModal from './AdditemDish';
import { toast } from 'react-toastify';

const DishManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDish, setEditDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fourtrip-server.onrender.com/api/products?created_by=' + localStorage.getItem('id_partner_shop') + '&is_deleted=false');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (newProduct) => {
    try {
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    }
  };

  const handleEditDish = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    setEditDish(productToEdit);
    setIsModalOpen(true);
  };
  
  const handleSaveDish = async (updatedProduct) => {
    try {
      setProducts(products.map((product) => 
        (product._id === updatedProduct._id ? updatedProduct : product)
      ));
      setEditDish(null);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  const handleDeleteDish = async (id) => {
    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_partner_shop')}`
        },
        body: JSON.stringify({ is_deleted: true })
      });
      
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const handleToggleActive = async (id, newStatus) => {
    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_partner_shop')}`
        },
        body: JSON.stringify({ is_active: newStatus })
      });
      
      if (response.ok) {
        setProducts(products.map(product => 
          product._id === id ? { ...product, is_active: newStatus } : product
        ));
        toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Error updating product status');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow w-full px-6">
      <div className="p-4 border-b mb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus:ring-0 outline-none pl-2"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setIsModalOpen(true);
                setEditDish(null);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Discounted Price</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-4">{product.name}</td>
              <td className="p-4">₹{product.price}</td>
              <td className="p-4">₹{product.discounted_price || '-'}</td>
              <td className="p-4">
                <div 
                  onClick={() => handleToggleActive(product._id, !product.is_active)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer
                    ${product.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
                    ${product.is_active ? 'translate-x-6' : 'translate-x-0'}`}>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDeleteDish(product._id)} 
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleEditDish(product._id)} 
                    className="p-1 text-blue-500 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditDish(null);
        }}
        onAddItem={editDish ? handleSaveDish : handleAddItem}
        editDish={editDish}
      />
    </div>
  );
};

export default DishManager;