import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";

// Property Management Form Component
export function AddPropertyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    square_footage: "",
    bedrooms: 0,
    bathrooms: 0,
    features: "",
    imageFile: null,
    type: "House",
    city: "",
    rentAmount:"",
    rent_type: "month",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]); // State for city options
  const navigate = useNavigate();

  // Fetch cities from the backend when the component loads
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/cities");
        setCities(response.data); // Assuming response.data is an array of cities
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form step navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Submit Property Registration
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      let imageUrl = "";
      if (formData.imageFile) {
        const imageData = new FormData();
        imageData.append("file", formData.imageFile);
        imageData.append("upload_preset", "ml_default");
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dezn9ks7m/image/upload",
          imageData
        );
        imageUrl = response.data.secure_url;
      }

      await axios.post("http://localhost:3000/api/property", {
        ...formData,
        image_url: imageUrl,
      });

      alert("Property registered successfully");
      navigate("/property");
    } catch (error) {
      console.error("Error registering property:", error);
      alert("There was an error submitting the property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add New Property" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden bg-gray-800 rounded-md shadow-lg p-6">
              <div className="text-center text-white mb-4">
                Step {step} of 3
              </div>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">
                    Basic Information
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-gray-300">Upload Image</label>
                      <input
                        type="file"
                        name="imageFile"
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Property name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Property description"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Property location"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">
                    Property Details
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-gray-300">Square Footage</label>
                      <input
                        type="text"
                        name="square_footage"
                        value={formData.square_footage}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Square footage"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300">Bedrooms</label>
                        <input
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleChange}
                          className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                          placeholder="No. of bedrooms"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-gray-300">Bathrooms</label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleChange}
                          className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                          placeholder="No. of bathrooms"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300">Features</label>
                      <input
                        type="text"
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="Property features"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Information */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">
                    Additional Information
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-gray-300">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        required
                      >
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300">Rent Type</label>
                      <select
                        name="rent_type"
                        value={formData.rent_type}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        required
                      >
                        <option value="month">Monthly</option>
                        <option value="3-month">3-Month</option>
                        <option value="6-month">6-Month</option>
                        <option value="9-month">9-Month</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300">City</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300">rentAmount</label>
                      <input
                        type="text"
                        name="rentAmount"
                        value={formData.rentAmount}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
                        placeholder="rentAmount"
                        required
                      />
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
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
                  >
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
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

export default AddPropertyForm;
