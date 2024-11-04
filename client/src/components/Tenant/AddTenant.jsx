import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

export function AddTenant() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    propertyId: '',
    terms: '',
    paymentStatus: 'Due',
  });
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/properties');
        setProperties(response.data); 
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
    scrollToForm();
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    scrollToForm();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await axios.post('http://localhost:3000/api/tenants', {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        property: formData.propertyId,
        lease: {
          terms: formData.terms,
          startDate: Date.now(), // Set startDate to the current date
        },
        paymentStatus: formData.paymentStatus,
      });

      await axios.put(`http://localhost:3000/api/property/${formData.propertyId}`, {
        isRented: true,
      });

      alert('Tenant registered successfully and property marked as rented.');
      navigate('/tenants');
    } catch (error) {
      console.error('Error registering tenant or updating property:', error);
      alert('There was an error submitting the tenant information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add New Tenant" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div ref={formRef} className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden bg-gray-800 rounded-md shadow-lg p-6">
              <div className="text-center text-white mb-4">Step {step} of 3</div>

              {/* Step 1: Tenant Basic Information */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Basic Information</h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-gray-300">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Tenant name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Phone number"
                        required
                      />
                    </div>
                   
                    <div>
                      <label className="text-base font-medium text-gray-300">Select Property</label>
                      <select
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleChange}
                        className="block w-full py-3 px-4 text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600"
                        required
                      >
                        <option value="">Select a property</option>
                        {properties.map((property) => (
                          <option key={property._id} value={property._id}>
                            {property.name} {property.isRented ? "(Rented)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Lease Details */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Lease Details</h3>
                  <div className="space-y-4 mt-4">
                  <div>
                      <label className="text-gray-300">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Enter address"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Payment Information</h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-gray-300">Payment Terms</label>
                      <textarea
                        name="terms"
                        value={formData.terms}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Payment terms and conditions"
                      ></textarea>
                    </div>
                    <div>
                      <label className="text-gray-300">Payment Status</label>
                      <select
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        required
                      >
                        <option value="Due">Due</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`ml-auto px-4 py-2 ${isLoading ? 'bg-gray-600' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700`}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddTenant;
