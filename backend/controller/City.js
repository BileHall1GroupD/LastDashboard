// backend/controllers/cityController.js
import City from "../model/City.js";

// Controller for creating a new city
export const createCity = async (req, res) => {
  try {
    const { name, postcode, state } = req.body;
    const newCity = new City({ name, postcode, state });
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating city", error: error.message });
  }
};

// Controller for fetching all cities
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cities", error: error.message });
  }
};

// Controller for fetching a single city by ID
export const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json(city);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching city", error: error.message });
  }
};

// Controller for updating a city by ID
export const updateCity = async (req, res) => {
  try {
    const { name, postcode, state } = req.body;
    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      { name, postcode, state },
      { new: true }
    );
    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json(updatedCity);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating city", error: error.message });
  }
};

// Controller for deleting a city by ID
export const deleteCity = async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting city", error: error.message });
  }
};
