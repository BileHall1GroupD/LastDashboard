import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';

const TenantTable = () => {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // New state to track edit mode
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getAllnonDeclined');
        setTenants(response.data);
        setFilteredTenants(response.data); 
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };
    fetchTenants();
  }, []);

  const handleAddNew = () => {
    navigate("/AddTenant");
  };

  const handleEditClick = (tenant) => {
    setIsEditing(true); // Set edit mode to true
    navigate(`/EditTenant/${tenant._id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this tenant?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`http://localhost:3000/api/tenants/${id}`);
      setTenants((prevTenants) => prevTenants.filter((tenant) => tenant._id !== id));
      setFilteredTenants((prevTenants) => prevTenants.filter((tenant) => tenant._id !== id));
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete the tenant.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(term) ||
        tenant.email.toLowerCase().includes(term) ||
        tenant.property?.name.toLowerCase().includes(term)
    );
    setFilteredTenants(filtered);
  };

  // If editing, do not render the table
  if (isEditing) {
    return null;
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Tenant List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenants..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-4"
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>

      {filteredTenants.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Property Name</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lease Start</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lease End</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Status</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Declined</th>
                  <th className="w-1/12 px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredTenants.map((tenant) => (
                  <motion.tr
                    key={tenant._id}
                    className="hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.property?.name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.address}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tenant.lease.startDate ? new Date(tenant.lease.startDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tenant.lease.endDate ? new Date(tenant.lease.endDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.paymentStatus}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.declined ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 text-center flex gap-2">
                      <button
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleEditClick(tenant)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(tenant._id)}
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
        <p className="text-center text-gray-500">No available tenants to display.</p>
      )}
    </motion.div>
  );
};

export default TenantTable;