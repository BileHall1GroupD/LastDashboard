import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const TenantHistory = () => {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);

  useEffect(() => {
    const fetchTenantHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tenants');
        setTenants(response.data);
        setFilteredTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenant history:', error);
      }
    };
    fetchTenantHistory();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = tenants.filter((tenant) =>
      tenant.name.toLowerCase().includes(term) ||
      tenant.phoneNumber?.toLowerCase().includes(term) ||
      tenant.property?.name.toLowerCase().includes(term) ||
      tenant.address?.toLowerCase().includes(term) ||
      (tenant.lease?.startDate ? new Date(tenant.lease.startDate).toLocaleDateString().toLowerCase() : '').includes(term) ||
      (tenant.lease?.endDate ? new Date(tenant.lease.endDate).toLocaleDateString().toLowerCase() : '').includes(term) ||
      tenant.paymentStatus?.toLowerCase().includes(term) ||
      (tenant.declined ? 'yes' : 'no').includes(term)
    );

    setFilteredTenants(filtered);
  };

  const generateReport = () => {
    const csv = Papa.unparse(
      filteredTenants.map((tenant) => ({
        name: tenant.name,
        phoneNumber: tenant.phoneNumber || 'N/A',
        propertyName: tenant.property?.name || 'N/A',
        address: tenant.address || 'N/A',
        startDate: tenant.lease?.startDate ? new Date(tenant.lease.startDate).toISOString().split('T')[0] : 'N/A',
        endDate: tenant.lease?.endDate ? new Date(tenant.lease.endDate).toISOString().split('T')[0] : 'N/A',
        paymentStatus: tenant.paymentStatus || 'N/A',
        declined: tenant.declined ? 'Yes' : 'No',
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'TenantHistoryReport.csv');
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Tenant History</h2>
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
      </div>
      <button
        onClick={generateReport}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition-colors"
      >
        Generate Report
      </button>

      {filteredTenants.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Property Name</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lease Start</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lease End</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Status</th>
                  <th className="w-1/8 px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Declined</th>
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.phoneNumber || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.property?.name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.address || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tenant.lease?.startDate ? new Date(tenant.lease.startDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {tenant.lease?.endDate ? new Date(tenant.lease.endDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.paymentStatus || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.declined ? 'Yes' : 'No'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No tenant history available to display.</p>
      )}
    </motion.div>
  );
};

export default TenantHistory;