import React from "react";
import Header from "../components/common/Header";
import TenantHistory from "../components/Tenants_history/TenantHistory";

const TenantsHistory = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Tenant History' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
			<TenantHistory/>
			</main>
		</div>
	);
};
export default TenantsHistory;
