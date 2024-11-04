import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";
import TenantTable from "../components/Tenant/TenantTable";

import React from "react";

const TenantsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Tenants' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

				{/* SALES TABLE */}
				<TenantTable /> {/* Displaying sales data table */}

				

			</main>
		</div>
	);
};

export default TenantsPage;
