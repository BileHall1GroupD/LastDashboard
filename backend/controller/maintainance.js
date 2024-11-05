import MaintenanceRequest from '../model/maintainance.js';
import { sendSms } from '../utilities/Sms.js';
import Contractor from '../model/contracts.js';

// Create a new maintenance request (for tenants to submit requests)
export const createMaintenanceRequest = async (req, res) => {
    try {
        const { tenantId, propertyId, description, priority } = req.body;

        // Create new maintenance request
        const newRequest = new MaintenanceRequest({
            tenantId,
            propertyId,
            description,
            priority,
        });

        await newRequest.save();
        res.status(201).json({ message: 'Maintenance request created successfully', data: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create maintenance request', error: error.message });
    }
};

// Assign a contractor to the maintenance request and send SMS
export const assignContractorToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { contractorId, assignmentDate } = req.body;

        // Find the maintenance request by ID and populate tenant details
        const maintenanceRequest = await MaintenanceRequest.findById(id).populate('tenantId');
        if (!maintenanceRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        // Update contractor details and status
        maintenanceRequest.contractorId = contractorId;
        maintenanceRequest.assignmentDate = assignmentDate || new Date();
        maintenanceRequest.status = 'In Progress';
        await maintenanceRequest.save();

        // Fetch the contractor's and tenant's details
        const contractor = await Contractor.findById(contractorId);
        const tenant = maintenanceRequest.tenantId;
        if (!contractor || !tenant) {
            return res.status(404).json({ message: 'Contractor or Tenant not found' });
        }

        // Prepare and send SMS to the contractor
        const smsContent = `You have been assigned to a new maintenance request. Details: ${maintenanceRequest.description}. Tenant Phone: ${tenant.phoneNumber}. Tenant Location: ${tenant.address}.`;
        await sendSms(contractor.phone, smsContent);

        res.status(200).json({ message: 'Contractor assigned successfully and notified via SMS', data: maintenanceRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign contractor', error: error.message });
    }
};

// Update a maintenance request by ID
export const updateMaintenanceRequest = async (req, res) => {
    try {
        const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }
        res.status(200).json({ message: 'Maintenance request updated successfully', data: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update maintenance request', error: error.message });
    }
};

// Get all maintenance requests, with optional status filter
export const getAllMaintenanceRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const maintenanceRequests = await MaintenanceRequest.find(query)
            .populate('tenantId')
            .populate('propertyId')
            .populate('contractorId');

        res.status(200).json({ data: maintenanceRequests });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve maintenance requests', error: error.message });
    }
};

// Delete a maintenance request by ID
export const deleteMaintenanceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRequest = await MaintenanceRequest.findByIdAndDelete(id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        res.status(200).json({ message: 'Maintenance request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete maintenance request', error: error.message });
    }
};

// Get a maintenance request by ID
export const getMaintenanceRequestById = async (req, res) => {
    try {
        const maintenanceRequest = await MaintenanceRequest.findById(req.params.id);
        if (!maintenanceRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }
        res.status(200).json({ data: maintenanceRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance request', error: error.message });
    }
};
