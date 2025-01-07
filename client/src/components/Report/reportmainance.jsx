import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reportmainance = () => {
    const [requests, setRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const reportRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/Report/maintenance`, {
                params: { status: statusFilter },
            });
            setRequests(Array.isArray(response.data.maintenanceRequests) ? response.data.maintenanceRequests : []);
        } catch (error) {
            console.error('Error fetching maintenance requests:', error.message);
        }
    };

    const handleGenerateReport = () => {
        navigate('/generate-report', { state: { statusFilter } });
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Maintenance Report</h2>
                <div className="flex items-center justify-between mb-4">
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                        className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button
                        onClick={handleGenerateReport}
                        className="p-2 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Generate Report
                    </button>
                </div>
                <div ref={reportRef} className="bg-gray-900 text-white p-4 rounded-lg shadow-inner">
                    <table className="w-full text-left border-collapse overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 font-semibold text-gray-300 border-b border-gray-600">Tenant</th>
                                <th className="px-4 py-2 font-semibold text-gray-300 border-b border-gray-600">Status</th>
                                <th className="px-4 py-2 font-semibold text-gray-300 border-b border-gray-600">Priority</th>
                                <th className="px-4 py-2 font-semibold text-gray-300 border-b border-gray-600">Request Date</th>
                                <th className="px-4 py-2 font-semibold text-gray-300 border-b border-gray-600">Assignment Date</th>
                                <th className="px-4 py-2 font-semibold text-gray-300 border-b border-gray-600">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((request, index) => (
                                    <tr key={request._id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                                        <td className="px-4 py-2 border-b border-gray-700">{request.tenantId?.name || 'N/A'}</td>
                                        <td className="px-4 py-2 border-b border-gray-700">{request.status}</td>
                                        <td className="px-4 py-2 border-b border-gray-700">{request.priority}</td>
                                        <td className="px-4 py-2 border-b border-gray-700">{new Date(request.requestDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 border-b border-gray-700">{request.assignmentDate ? new Date(request.assignmentDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-4 py-2 border-b border-gray-700">{request.description}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reportmainance;
