import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/Header';

export function EditTenant() {
  const [formState, setFormState] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    property: '',
    startDate: '',
    endDate: '',
    terms: '',
    paymentStatus: 'Due',
    declined: false,
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/tenants/${id}`)
        .then(response => {
          const data = response.data;
          setFormState({
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address || '',
            property: data.property?._id || data.property,
            startDate: data.lease.startDate ? new Date(data.lease.startDate).toISOString().substring(0, 10) : '',
            endDate: data.lease.endDate ? new Date(data.lease.endDate).toISOString().substring(0, 10) : '',
            terms: data.lease.terms || '',
            paymentStatus: data.paymentStatus,
            declined: data.declined || false,
          });
        })
        .catch(error => {
          console.error('Error fetching tenant:', error);
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormState((prevState) => {
      // If 'declined' is checked, set endDate to current date
      if (name === 'declined' && checked) {
        return {
          ...prevState,
          [name]: checked,
          endDate: new Date().toISOString().substring(0, 10), // Set endDate to today
        };
      }
      return {
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If the lease is declined, call the decline endpoint and set the property to available
      if (formState.declined) {
        await axios.patch(`http://localhost:3000/api/tenants/${id}/decline`, {
          declined: true,
          endDate: formState.endDate,
        });

        // Update property to set `rented` to false
        if (formState.property) {
          await axios.put(`http://localhost:3000/api/property/${formState.property}`, {
            isRented: false,
          });
        }
      } else {
        // Update tenant details including lease information
        await axios.put(`http://localhost:3000/api/tenants/${id}`, {
          ...formState,
          lease: {
            startDate: formState.startDate,
            endDate: formState.endDate,
            terms: formState.terms,
          },
        });
      }

      alert('Tenant updated successfully');
      navigate('/tenants');
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Failed to update the tenant.');
    }
  };

  return (
    <div className="flex-1 relative z-10 h-screen overflow-y-auto">
      <Header title="Edit Tenant" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Tenant name' },
                  { label: 'Phone Number', name: 'phoneNumber', type: 'text', placeholder: 'Phone number' },
                  { label: 'Email', name: 'email', type: 'email', placeholder: 'Email address' },
                  { label: 'Address', name: 'address', type: 'text', placeholder: 'Address (optional)' },
                  { label: 'Property ID', name: 'property', type: 'text', placeholder: 'Property ID' },
                  { label: 'Lease Start Date', name: 'startDate', type: 'date' },
                  { label: 'Lease End Date', name: 'endDate', type: 'date' },
                  { label: 'Terms', name: 'terms', type: 'text', placeholder: 'Lease terms (optional)' },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name} className="col-span-1">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formState[name]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      required={name !== 'address' && name !== 'terms'}
                    />
                  </div>
                ))}

                {/* Payment Status Select Field */}
                <div className="col-span-1">
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formState.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="Paid">Paid</option>
                    <option value="Due">Due</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                {/* Declined Checkbox */}
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    name="declined"
                    checked={formState.declined}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900 mr-2"
                  />
                  <label className="text-sm font-medium text-gray-400">Declined</label>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Update Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditTenant;