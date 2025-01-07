import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GenerateReport = () => {
    const location = useLocation();
    const statusFilter = location.state?.statusFilter || ''; // Retrieve statusFilter from state
    const [requests, setRequests] = useState([]);
    const reportRef = useRef();

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/Report/maintenance', {
                params: { status: statusFilter },
            });
            setRequests(Array.isArray(response.data.maintenanceRequests) ? response.data.maintenanceRequests : []);
        } catch (error) {
            console.error('Error fetching maintenance requests:', error.message);
        }
    };

    const handlePrint = () => {
        const input = reportRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Maintenance_Report.pdf');
        });
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-300 " style={{ filter: 'none', position: 'relative', zIndex: 10 }}>
            <div className="max-w-7xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg" ref={reportRef}>
                <div className="flex justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-400">Maintenance Report</h1>
                        <p className="text-gray-400">Company Address: Hodan District</p>
                        <p className="text-gray-400">Phone: +252 0613775927</p>
                        <p className="text-gray-400">Email: Group8@gmail.com</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400">Report Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-gray-400">Total Requests: {requests.length}</p>
                    </div>
                </div>

                <table className="w-full text-left border border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700 text-gray-400">
                        <tr>
                            <th className="px-4 py-2">Tenant</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Priority</th>
                            <th className="px-4 py-2">Request Date</th>
                            <th className="px-4 py-2">Assignment Date</th>
                            <th className="px-4 py-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((request, index) => (
                                <tr key={request._id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                                    <td className="px-4 py-2 border-t border-gray-600">{request.tenantId?.name || 'N/A'}</td>
                                    <td className="px-4 py-2 border-t border-gray-600">{request.status}</td>
                                    <td className="px-4 py-2 border-t border-gray-600">{request.priority}</td>
                                    <td className="px-4 py-2 border-t border-gray-600">{new Date(request.requestDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-t border-gray-600">{request.assignmentDate ? new Date(request.assignmentDate).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-4 py-2 border-t border-gray-600">{request.description}</td>
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

            <div className="flex justify-center mt-8">
                <button onClick={handlePrint} className="p-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 mx-2">
                    Download PDF
                </button>
                <button onClick={() => window.print()} className="p-3 bg-green-600 rounded text-white font-semibold hover:bg-green-700 mx-2">
                    Print Report
                </button>
            </div>
        </div>
    );
};

export default GenerateReport;
