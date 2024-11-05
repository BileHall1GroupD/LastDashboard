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
        <div className="p-6 bg-gray-800 min-h-screen text-white">
            <h2 className="text-3xl font-semibold mb-6">Maintenance Requests Report</h2>
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                        className="p-2 rounded bg-gray-700 text-white border border-gray-600"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button
                        onClick={handleGenerateReport}
                        className="p-2 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700"
                    >
                        Generate Report
                    </button>
                </div>
                <div ref={reportRef} className="bg-gray-100 text-black p-4 rounded-lg shadow-inner">
                    <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 font-semibold">Tenant</th>
                                <th className="px-4 py-2 font-semibold">Status</th>
                                <th className="px-4 py-2 font-semibold">Priority</th>
                                <th className="px-4 py-2 font-semibold">Request Date</th>
                                <th className="px-4 py-2 font-semibold">Assignment Date</th>
                                <th className="px-4 py-2 font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((request, index) => (
                                    <tr key={request._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="px-4 py-2 border-t border-gray-300">{request.tenantId?.name || 'N/A'}</td>
                                        <td className="px-4 py-2 border-t border-gray-300">{request.status}</td>
                                        <td className="px-4 py-2 border-t border-gray-300">{request.priority}</td>
                                        <td className="px-4 py-2 border-t border-gray-300">{new Date(request.requestDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 border-t border-gray-300">{request.assignmentDate ? new Date(request.assignmentDate).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-4 py-2 border-t border-gray-300">{request.description}</td>
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
