import Tenant from '../model/Tenants.js';

// Create a new tenant
export const createTenant = async (req, res) => {
  try {
    const tenant = new Tenant(req.body);
    await tenant.save();
    res.status(201).json({ message: 'Tenant created successfully', tenant });
  } catch (error) {
    res.status(400).json({ message: 'Error creating tenant', error });
  }
};

// Get all tenants
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('property', 'name'); // Only fetches property name
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tenants', error });
  }
};

export const getAllnonDeclined= async (req, res) => {
  try {
    const tenants = await Tenant.find({declined:false}).populate('property', 'name'); // Only fetches property name
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tenants', error });
  }
};

// Get tenant by ID
export const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('property', 'name');
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tenant', error });
  }
};

// Update tenant by ID
export const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.status(200).json({ message: 'Tenant updated successfully', tenant });
  } catch (error) {
    res.status(400).json({ message: 'Error updating tenant', error });
  }
};

// Decline a tenant lease
export const declineTenantLease = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    // Set lease status to 'Declined' and update endDate to the current date
    tenant.leaseStatus = 'Declined';
    tenant.lease.endDate = new Date();
    await tenant.save();

    res.status(200).json({ message: 'Lease declined successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error declining lease', error });
  }
};

// End a tenant lease
export const endTenantLease = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    // Set lease status to 'Ended' and update endDate to the current date
    tenant.leaseStatus = 'Ended';
    tenant.lease.endDate = new Date();
    await tenant.save();

    res.status(200).json({ message: 'Lease ended successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error ending lease', error });
  }
};

// Delete tenant by ID
export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tenant', error });
  }
};
