import express from "express";
import Tenant from "../model/Tenants.js";

const router = express.Router();

// API endpoint to get tenant data with populated properties
router.get("/invoices", async (req, res) => {
  try {
    // Fetch tenants and populate specific fields from the property
    const tenants = await Tenant.find()
      .select('name phoneNumber email property')
      .populate('property', 'name type location rent_type rentAmount');

    res.status(200).json(tenants);
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    res.status(500).json({ error: "Failed to fetch invoice data" });
  }
});

export default router;
