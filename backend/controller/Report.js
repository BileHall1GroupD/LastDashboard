import MaintenanceRequest from '../model/maintainance.js';
import Tenant from '../model/Tenants.js';
import Property from '../model/properties.js';
import Contractor from '../model/contracts.js';

const ReportController = {
    async getMaintenanceReport(req, res) {
        try {
            const { status, priority, startDate, endDate } = req.query;
            const query = {};

            // Apply status filter if present
            if (status) query.status = status;
            if (priority) query.priority = priority;
            if (startDate && endDate) {
                query.requestDate = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }

            const maintenanceRequests = await MaintenanceRequest.find(query)
                .populate('tenantId', 'name email')
                .populate('propertyId', 'name location type')
                .populate('contractorId', 'name skills')
                .exec();

            res.status(200).json({
                reportSummary: {
                    totalRequests: maintenanceRequests.length,
                    pendingRequests: maintenanceRequests.filter(req => req.status === 'Pending').length,
                    inProgressRequests: maintenanceRequests.filter(req => req.status === 'In Progress').length,
                    completedRequests: maintenanceRequests.filter(req => req.status === 'Completed').length,
                },
                maintenanceRequests,
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate report', details: error.message });
        }
    },

    async getContractorPerformanceReport(req, res) {
        try {
            const contractors = await Contractor.find();

            const performanceReport = await Promise.all(
                contractors.map(async (contractor) => {
                    const completedRequests = await MaintenanceRequest.countDocuments({
                        contractorId: contractor._id,
                        status: 'Completed',
                    });

                    return {
                        contractor: contractor.name,
                        email: contractor.email,
                        phone: contractor.phone,
                        skills: contractor.skills,
                        completedRequests,
                    };
                })
            );

            res.status(200).json(performanceReport);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate contractor performance report', details: error.message });
        }
    },
};

export default ReportController;
