import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";


export function AddCity() {
  const [formData, setFormData] = useState({
    name: "",
    postcode: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:3000/api/cities", {
        ...formData,
      });

      alert("City added successfully");
      navigate("/City");
    } catch (error) {
      console.error("Error adding city:", error);
      alert("There was an error submitting the city. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add New City" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden bg-gray-800 rounded-md shadow-lg p-6">
              <div className="text-center text-white mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Add New City
                </h3>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-gray-300">City Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                    placeholder="City name"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300">Postcode</label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                    placeholder="City postcode"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`ml-auto px-4 py-2 ${
                    isLoading ? "bg-gray-600" : "bg-blue-600"
                  } text-white rounded-md hover:bg-blue-700`}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddCity;
