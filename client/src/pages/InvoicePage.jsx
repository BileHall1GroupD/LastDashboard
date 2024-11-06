import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../components/Invoice/ViewTableInvoice';

const InvoicePage = () => {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tenants data
        const tenantResponse = await axios.get('/api/tenants');
        setTenants(tenantResponse.data);

        // Fetch properties data
        const propertyResponse = await axios.get('/api/properties');
        setProperties(propertyResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getPropertyDetails = (propertyId) => {
    return properties.find(property => property._id === propertyId) || {};
  };

  return (
    <div className="flex-1 relative z-10 overflow-y-auto h-screen p-4 bg-gray-900 text-gray-100">
      <Header title="Invoice" />
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">Property Management System</h2>
            <p>123 Main St, Anytown, USA 12345</p>
          </div>
          <div>
            {selectedTenant && (
              <PDFDownloadLink
                document={<InvoicePDF tenant={selectedTenant} property={getPropertyDetails(selectedTenant.property)} />}
                fileName={`invoice-${selectedTenant.name}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" disabled>
                      Loading...
                    </button>
                  ) : (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Generate PDF
                    </button>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium">Bill To:</h3>
            <p>{selectedTenant ? selectedTenant.name : 'Select a tenant'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Property:</h3>
            <p>{selectedTenant ? getPropertyDetails(selectedTenant.property).location : 'Select a tenant'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Invoice Date:</h3>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Due Date:</h3>
            <p>{new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium">Description</h3>
          <p>Monthly Rent</p>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Amount</span>
            <span>${selectedTenant ? getPropertyDetails(selectedTenant.property).rentAmount : '0.00'}</span>
          </div>
        </div>

        <div className="flex justify-between mt-4 border-t border-gray-700 pt-4">
          <span className="font-medium">Total:</span>
          <span>${selectedTenant ? getPropertyDetails(selectedTenant.property).rentAmount : '0.00'}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
