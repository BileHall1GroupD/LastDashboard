import mongoose from 'mongoose';

const rentalInvoiceSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount: { type: Number, required: true },
  due_date: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  created_at: { type: Date, default: Date.now }
});

const RentalInvoice = mongoose.model('RentalInvoice', rentalInvoiceSchema);
export default RentalInvoice;
