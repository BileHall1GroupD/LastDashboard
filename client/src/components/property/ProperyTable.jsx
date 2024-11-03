import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';

const TableWithActions = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/properties');
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleAddNew = () => {
    navigate("/AddProductForm");
  };

  const handleEditClick = (property) => {
    navigate(`/EditProperty/${property._id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this property?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`http://localhost:3000/api/property/${id}`);
      setProperties((prevProperties) => prevProperties.filter((property) => property._id !== id));
      setFilteredProperties((prevProperties) => prevProperties.filter((property) => property._id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete the property.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = properties.filter(
      (property) =>
        property.name.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term)
    );
    setFilteredProperties(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Property List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-4"
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-96" style={{ minWidth: '1000px' }}>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rent Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredProperties.map((property) => (
                  <motion.tr
                    key={property._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <img
                        src={property.image_url}
                        alt={`${property.name} cover`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{property.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{property.location}</td>     
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{property.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{property.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{property.rent_status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex gap-2">
                      <button
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleEditClick(property)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(property._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No available properties to display.</p>
      )}
    </motion.div>
  );
};

export default TableWithActions;
