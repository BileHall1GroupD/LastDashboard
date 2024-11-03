import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    skills: {
        type: [String], 
        default: [],
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
