import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function EditContractorForm() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    skills: '',
    available: 'true',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/contractors/${id}`)
        .then(response => {
          const data = response.data.data;
          setFormState({
            name: data.name,
            phone: data.phone,
            email: data.email,
            skills: data.skills ? data.skills.join(', ') : '',
            available: data.available ? 'true' : 'false',
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching contractor:', error);
          setError('Failed to load contractor details. Please try again later.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/contractors/${id}`, {
        ...formState,
        skills: formState.skills.split(',').map(skill => skill.trim()),
      });
      toast.success('Contractor updated successfully');
      navigate('/Contactors');
    } catch (error) {
      console.error('Error updating contractor:', error);
      toast.error('Failed to update contractor.');
    }
  };

  if (loading) {
    return <p>Loading contractor details...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="flex-1 relative z-10 h-screen overflow-y-auto">
      <Header title="Edit Contractor" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Contractor name"
                    className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Contractor email"
                    className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formState.skills}
                    onChange={handleInputChange}
                    placeholder="Skills (comma-separated)"
                    className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Available</label>
                  <select
                    name="available"
                    value={formState.available}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Update Contractor
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}

export default EditContractorForm;
