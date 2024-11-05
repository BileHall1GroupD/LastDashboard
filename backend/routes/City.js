// backend/routes/cityRoutes.js
import express from "express";
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} from "../controller/City.js";

const router = express.Router();

router.post("/cities", createCity);
router.get("/cities", getAllCities);
router.get("/cities/:id", getCityById);
router.put("/cities/:id", updateCity);
router.delete("/cities/:id", deleteCity);

export default router;
