import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/login";
import ProductsPage from "./pages/PropertyPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AddPropertyForm from "./components/property/AddProperty";
import EditProperty from "./components/property/EditProperty";
import AddTenant from "./components/Tenant/AddTenant";
import EditTenant from "./components/Tenant/EditTenant";
import Contactors from "./pages/Contactors";
import EditContractorForm from "./components/Contractors/EditContractor";
import AddContractor from "./components/Contractors/AddContractor";
import Dashboard from "./pages/Dashbord";
import MaintenanceTable from "./components/maintenance/MaintenanceTable";
import AddMaintenance from "./components/maintenance/AddMaintenance";
import TenantsPage from "./pages/Tenants";
import TenantsHistory from "./pages/TeanatHistory";

import City from "./pages/City";
import CityTable from "./components/City/CityTables";
import AddCity from "./components/City/AddCity";
import EditCity from "./components/City/EditCity"; 

import ReportPage from './pages/Report';
import GenerateReport from './components/Report/GenarateReport';
import InvoicePage from "./pages/InvoicePage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/property" element={<ProductsPage />} />
        <Route path="/AddProductForm" element={<AddPropertyForm />} />
        <Route path="/EditProperty/:id" element={<EditProperty />} />
        <Route path="/AddTenant" element={<AddTenant />} />
        <Route path="/EditTenant/:id" element={<EditTenant />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/Tenants" element={<TenantsPage />} />
        <Route path="/Contactors" element={<Contactors />} />
        <Route path="/EditContactor/:id" element={<EditContractorForm />} />
        <Route path="/AddContactor" element={<AddContractor />} />
        <Route path="/maintenance" element={<MaintenanceTable />} />
        <Route path="/Addmaintenance" element={<AddMaintenance />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/TenantsHistory" element={<TenantsHistory />} />

        <Route path="/City" element={<City />} />
        <Route path="/CityTable" element={<CityTable />} />
        <Route path="/AddCity" element={<AddCity />} /> 
        <Route path="/EditCity/:id" element={<EditCity />} />

        < Route path='/Report' element={<ReportPage/>}/>
        <Route path="/generate-report" element={<GenerateReport />} />
        <Route path="/invoices" element={<InvoicePage />} /> 

      </Route>
    </Routes>
  );
}

export default App;
