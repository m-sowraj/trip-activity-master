import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AddItemModal from './AdditemDish';
import { toast } from 'react-toastify';

const DishManager = ({ dishes, setDishes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDish, setEditDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('https://fourtrip-server.onrender.com/api/activity', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token_partner_rest')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDishes(data.data);
      } else {
        toast.error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (newItem) => {
    setDishes(prev => [...prev, newItem]);
  };

  const toggleAvailability = async (id) => {
    try {
      const dish = dishes.find(d => d._id === id);
      const response = await fetch(`https://fourtrip-server.onrender.com/api/activity/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_partner_rest')}`
        },
        body: JSON.stringify({
          available: !dish.available
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setDishes(dishes.map(dish => 
          dish._id === id ? { ...dish, available: !dish.available } : dish
        ));
        toast.success('Availability updated successfully');
      } else {
        toast.error('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Error updating availability');
    }
  };

  const handleEditDish = (id) => {
    const dishToEdit = dishes.find((dish) => dish._id === id);
    setEditDish(dishToEdit);
    setIsModalOpen(true);
  };
  
  const handleSaveDish = (updatedDish) => {
    setDishes(dishes.map((dish) => (dish._id === updatedDish._id ? updatedDish : dish)));
    setEditDish(null);
  };

  const handleDeleteDish = async (id) => {
    try {
      const response = await fetch(`https://fourtrip-server.onrender.com/api/activity/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token_partner_rest')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setDishes(dishes.filter((dish) => dish._id !== id));
        toast.success('Activity deleted successfully');
      } else {
        toast.error('Failed to delete activity');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Error deleting activity');
    }
  };

  const filteredDishes = dishes.filter(dish => 
    dish.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search activities..."
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
              Add New Activity
            </button>
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Discount</th>
            <th className="p-4 text-left">Availability</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDishes.map((dish) => (
            <tr key={dish._id} className="border-b">
              <td className="p-4">{dish.title}</td>
              <td className="p-4">${dish.price}</td>
              <td className="p-4">{dish.discount_percentage}%</td>
          
              <td className="p-4">
                <div className="flex items-center">
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer ${dish.available ? 'bg-green-500' : 'bg-gray-300'}`}
                    onClick={() => toggleAvailability(dish._id)}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${dish.available ? 'translate-x-6' : ''}`} />
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDeleteDish(dish._id)} 
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleEditDish(dish._id)} 
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