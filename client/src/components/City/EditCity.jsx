import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../common/Header"; // Assuming you have a Header component

const EditCityForm = () => {
  const { id } = useParams(); // Get the city ID from the URL parameters
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    postcode: "", // Change postalCode to postcode
    state: "",
  }); // Initial state for form fields including postcode and state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch city data when the component mounts
    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cities/${id}`
        );

        // Ensure that the data structure matches what you're expecting
        if (response.data && response.data.name) {
          setFormState({
            name: response.data.name,
            postcode: response.data.postcode, // Retrieve postcode from the response
            state: response.data.state, // Retrieve state from the response
          }); // Populate form with existing city data
        } else {
          throw new Error("City data is not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching city:", error);
        setError("Failed to load city details. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    if (id) {
      fetchCityData();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value }); // Update form state on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.put(`http://localhost:3000/api/cities/${id}`, formState); // Send updated data to API
      alert("City updated successfully");
      navigate("/CityTable"); // Navigate back to the city table after successful update
    } catch (error) {
      console.error("Error updating city:", error);
      setError("Failed to update city. Please try again later."); // Set error message if update fails
    }
  };

  if (loading) return <p>Loading city details...</p>; // Show loading state
  if (error) return <p className="text-red-600">{error}</p>; // Show error message

  return (
    <div className="flex-1 relative z-10 h-screen overflow-y-auto">
      <Header title="Edit City" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  City Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="City name"
                  className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  Postcode
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode" // Ensure the input name is 'postcode'
                  value={formState.postcode} // Use postcode from state
                  onChange={handleChange}
                  placeholder="Postcode"
                  className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formState.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Update City
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/CityTable")}
                  className="ml-4 px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditCityForm;
