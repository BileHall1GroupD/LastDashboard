import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignContractorModal = ({ show, closeModal, requestId, refreshData }) => {
  const [contractors, setContractors] = useState([]);
  const [contractorId, setContractorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchContractors = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/contractors');
          setContractors(response.data.data || []);
        } catch (error) {
          console.error('Error fetching contractors:', error);
        }
      };

      fetchContractors();
      setContractorId(''); // Clear contractorId when modal opens
    }
  }, [show]);

  const handleContractorChange = (e) => {
    setContractorId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Assign contractor
      await axios.put(`http://localhost:3000/api/maintenance/${requestId}/assign`, {
        contractorId,
        assignmentDate: new Date(),
      });

      // Fetch contractor details for SMS
      const selectedContractor = contractors.find((c) => c._id === contractorId);
      const contractorPhone = selectedContractor ? selectedContractor.phone : null;

      if (contractorPhone) {
        try {
          // Send SMS
          const smsResponse = await axios.get(`https://tabaarakict.so/SendSMS.aspx`, {
            params: {
              user: 'Bile2024',
              pass: 'Bile@2024@',
              rec: contractorPhone,
              cont: 'You have been assigned a new maintenance request. Please check the system for details.',
            },
          });
          console.log("SMS sent successfully:", smsResponse.data);
        } catch (smsError) {
          console.error("Error sending SMS:", smsError.message);
          alert("Failed to send SMS notification to the contractor.");
        }
      } else {
        console.warn("Contractor phone number is not available.");
      }

      alert("Contractor assigned successfully");
      closeModal();
      refreshData(); // Refresh the data in the main table
    } catch (error) {
      console.error("Error assigning contractor:", error.message);
      alert("Failed to assign contractor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 relative border border-gray-700">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-300 text-xl">
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">Assign Contractor</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium mb-2">Select Contractor</label>
            <select
              value={contractorId}
              onChange={handleContractorChange}
              className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a Contractor</option>
              {contractors.map((contractor) => (
                <option key={contractor._id} value={contractor._id}>
                  {contractor.name} - {contractor.skills ? contractor.skills.join(', ') : 'No skills listed'}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 mt-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isLoading ? 'Assigning...' : 'Assign Contractor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignContractorModal;