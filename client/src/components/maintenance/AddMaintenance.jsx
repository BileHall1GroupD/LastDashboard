import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

export function AddMaintenance() {
  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    description: '',
    priority: 'Medium',
    contractorId: '',
  });
  const [tenants, setTenants] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantResponse = await axios.get('http://localhost:3000/api/tenants');
        const contractorResponse = await axios.get('http://localhost:3000/api/contractors');

        console.log("Tenant Response:", tenantResponse.data);
        console.log("Contractor Response:", contractorResponse.data);

        setTenants(tenantResponse.data || []);
        setContractors(contractorResponse.data.data || contractorResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    const selectedTenant = tenants.find((tenant) => tenant._id === tenantId);
    const associatedPropertyId = selectedTenant?.property?._id || '';
    const associatedPropertyName = selectedTenant?.property?.name || 'Select Property';

    setFormData((prevData) => ({
      ...prevData,
      tenantId,
      propertyId: associatedPropertyId,
      propertyName: associatedPropertyName,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:3000/api/maintenance', {
        ...formData,
      });

      alert('Maintenance request submitted successfully');
      navigate('/maintenance');
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      alert('There was an error submitting the maintenance request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="Add Maintenance Request" />
      <section className="py-10 bg-gray-900 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative max-w-2xl mx-auto mt-8">
            <div className="overflow-hidden bg-gray-800 rounded-md shadow-md">
              <div className="px-4 py-6 sm:px-8 sm:py-7">
                <form onSubmit={handleSubmit} method="POST">
                  {/* Tenant Selection */}
                  <div className="mb-5">
                    <label className="text-base font-medium text-gray-300">Tenant</label>
                    <select
                      name="tenantId"
                      value={formData.tenantId}
                      onChange={handleTenantChange}
                      className="block w-full py-3 px-4 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select Tenant</option>
                      {tenants.map((tenant) => (
                        <option key={tenant._id} value={tenant._id}>
                          {tenant.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Selection */}
                  <div className="mb-5">
                    <label className="text-base font-medium text-gray-300">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="block w-full py-3 px-4 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="mb-5">
                    <label className="text-base font-medium text-gray-300">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the maintenance issue"
                      className="block w-full py-3 px-4 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white ${isLoading ? 'bg-gray-600' : 'bg-blue-600'} border border-transparent rounded-md focus:outline-none hover:bg-blue-700`}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddMaintenance;
