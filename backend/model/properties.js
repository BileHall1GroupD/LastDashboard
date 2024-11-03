import mongoose from "mongoose";

// Property schema definition
const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    square_footage: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    features: { type: String, required: true },
    image_url: { type: String, required: true },
    type: { type: String, required: true, enum: ['House', 'Apartment', 'Commercial'] },
    rent_type: { type: String, required: true, enum: ['month', '3-month', '6-month','9-month','yearly'] },
    city: { type: String, required: true },
    neighborhood: { type: String, required: false },
    isRented: { type: Boolean, default: false }, 
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
