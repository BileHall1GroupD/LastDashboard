import MaintenanceRequest from '../model/maintainance.js';

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

export const assignContractorToRequest = async (req, res) => {
    try {
        const { id } = req.params; 
        const { contractorId, assignmentDate } = req.body;

        // Find the maintenance request by ID
        const maintenanceRequest = await MaintenanceRequest.findById(id);
        if (!maintenanceRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        // Update contractor details, regardless of current assignment
        maintenanceRequest.contractorId = contractorId;
        maintenanceRequest.assignmentDate = assignmentDate || new Date();
        maintenanceRequest.status = 'In Progress';

        await maintenanceRequest.save();
        res.status(200).json({ message: 'Contractor assigned successfully', data: maintenanceRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign contractor', error: error.message });
    }
};


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

// Other existing functions: ass

// Get all maintenance requests (Admin only)
export const getAllMaintenanceRequests = async (req, res) => {
    try {
        const maintenanceRequests = await MaintenanceRequest.find()
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

        // Find and delete the maintenance request by ID
        const deletedRequest = await MaintenanceRequest.findByIdAndDelete(id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }

        res.status(200).json({ message: 'Maintenance request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete maintenance request', error: error.message });
    }
};

export const getMaintenanceRequestById = async (req, res) => {
    try {
      const maintenanceRequest = await MaintenanceRequest.findById(req.params.id);
      if (!maintenanceRequest) {
        return res.status(404).json({ message: 'Maintenance request not found' });
      }
      res.status(200).json({ data: maintenanceRequest });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching maintenance request' });
    }
  };
  