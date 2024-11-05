import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../common/Header";

export function EditProperty() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    location: "",
    squareFootage: "",
    bedrooms: 0,
    bathrooms: 0,
    features: "",
    imageUrl: "",
    type: "House",
    city: "",
    neighborhood: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [cities, setCities] = useState([]); // New state to hold cities
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch the property details and cities on component mount
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/property/${id}`)
        .then((response) => {
          const data = response.data;
          setFormState({
            name: data.name,
            description: data.description,
            location: data.location,
            squareFootage: data.square_footage,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            features: data.features,
            imageUrl: data.image_url,
            type: data.type,
            city: data.city,
            neighborhood: data.neighborhood,
          });
        })
        .catch((error) => {
          console.error("Error fetching property:", error);
        });
    }

    // Fetch cities for dropdown
    axios
      .get("http://localhost:3000/api/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]:
        name === "bedrooms" || name === "bathrooms"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dezn9ks7m/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formState.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      await axios.put(`http://localhost:3000/api/property/${id}`, {
        ...formState,
        square_footage: formState.squareFootage,
        image_url: imageUrl,
      });
      alert("Property updated successfully");
      navigate("/property");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Edit Property" />
      <section className="py-4 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="relative max-w-6xl mx-auto">
            <div className="relative max-w-4xl mx-auto mt-4 bg-gray-800 rounded-md shadow-md p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      label: "Name",
                      name: "name",
                      type: "text",
                      placeholder: "Property name",
                    },
                    {
                      label: "Description",
                      name: "description",
                      type: "text",
                      placeholder: "Property description",
                    },
                    {
                      label: "Location",
                      name: "location",
                      type: "text",
                      placeholder: "Property location",
                    },
                    {
                      label: "Square Footage",
                      name: "squareFootage",
                      type: "text",
                      placeholder: "Square footage",
                    },
                    {
                      label: "Bedrooms",
                      name: "bedrooms",
                      type: "number",
                      placeholder: "No. of bedrooms",
                    },
                    {
                      label: "Bathrooms",
                      name: "bathrooms",
                      type: "number",
                      placeholder: "No. of bathrooms",
                    },
                    {
                      label: "Features",
                      name: "features",
                      type: "text",
                      placeholder: "Property features",
                    },
                    {
                      label: "Neighborhood",
                      name: "neighborhood",
                      type: "text",
                      placeholder: "Neighborhood (optional)",
                    },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="col-span-1">
                      <label className="text-sm font-medium text-gray-400 mb-2 block">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formState[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                        required={name !== "neighborhood"}
                      />
                    </div>
                  ))}

                  {/* Type Select Field */}
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formState.type}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  {/* City Select Dropdown */}
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      City
                    </label>
                    <select
                      name="city"
                      value={formState.city}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
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

                  {/* Image File Input */}
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Upload New Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full py-2 px-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Update Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditProperty;
