import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from './components/DashboardLayout';
import Login from './pages/login';
import ProductsPage from './pages/PropertyPage'; // Ensure this is the correct import
import AnalyticsPage from './pages/AnalyticsPage';
import EditProperty from './components/property/EditProperty';
import AddTenant from './components/Tenant/AddTenant';
import EditTenant from './components/Tenant/EditTenant';
import Contactors from './pages/Contactors';
import EditContractorForm from './components/Contractors/EditContractor';
import AddContractor from './components/Contractors/AddContractor';
import Dashboard from './pages/Dashbord';
import MaintenanceTable from './components/maintenance/MaintenanceTable';
import AddMaintenance from './components/maintenance/AddMaintenance';
import TenantsPage from './pages/Tenants';
import TenantsHistory from './pages/TeanatHistory';
import City from './pages/City';
import CityTable from './components/City/CityTables';
import AddCity from './components/City/AddCity';
import EditCity from './components/City/EditCity';
import ReportPage from './pages/Report';
import GenerateReport from './components/Report/GenarateReport';
import Users from './pages/Users';
import Register from './components/users/Registration';
import AddPropertyModal from './components/property/AddProperty';

function App() {
  return (
    <>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/property" element={<ProductsPage />} /> {/* PropertyPage */}
          <Route path="/EditProperty/:id" element={<EditProperty />} />
          <Route path='/Add-propery' element={<AddPropertyModal/>}/>
          <Route path="/AddTenant" element={<AddTenant />} />
          <Route path="/EditTenant/:id" element={<EditTenant />} />
          <Route path="/Tenants" element={<TenantsPage />} />
          <Route path="/Contactors" element={<Contactors />} />
          <Route path="/EditContactor/:id" element={<EditContractorForm />} />
          <Route path="/AddContactor" element={<AddContractor />} />
          <Route path="/maintenance" element={<MaintenanceTable />} />
          <Route path="/Addmaintenance" element={<AddMaintenance />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/TenantsHistory" element={<TenantsHistory />} />
          <Route path="/register" element={<Register />} />
          <Route path="/City" element={<City />} />
          <Route path="/CityTable" element={<CityTable />} />
          <Route path="/AddCity" element={<AddCity />} />
          <Route path="/EditCity/:id" element={<EditCity />} />
          <Route path="/Report" element={<ReportPage />} />
          <Route path="/generate-report" element={<GenerateReport />} />
          <Route path="/Users" element={<Users />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;