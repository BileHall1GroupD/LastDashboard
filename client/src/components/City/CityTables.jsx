import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";

const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cities");

        // Ensure the response structure is correctly handled
        const cityData = response.data?.data || response.data || [];

        console.log("Fetched Cities:", cityData); // Debug log to confirm data
        setCities(cityData);
        setFilteredCities(cityData);
      } catch (error) {
        console.error("Error fetching cities:", error.message);
      }
    };

    fetchCities();
  }, []);

  const handleAddNew = () => {
    navigate("/AddCity");
  };

  const handleEditClick = (city) => {
    navigate(`/EditCity/${city._id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this city?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/cities/${id}`);
      setCities((prev) => prev.filter((city) => city._id !== id));
      setFilteredCities((prev) => prev.filter((city) => city._id !== id));
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("Failed to delete the city.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(term)
    );
    setFilteredCities(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">City List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search cities..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-4"
          onClick={handleAddNew}
        >
          Add New City
        </button>
      </div>

      {filteredCities.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    City Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredCities.map((city) => (
                  <motion.tr
                    key={city._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {city.name}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleEditClick(city)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(city._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No available cities to display.
        </p>
      )}
    </motion.div>
  );
};

export default CityTable;
