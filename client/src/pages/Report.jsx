import React from 'react';
import Reportmainance from '../components/Report/reportmainance';
import Header from '../components/common/Header';

const ReportPage = () => {
    return (
        <div className="flex-1 relative z-10 overflow-y-auto h-screen p-4">
            <Header title={"maintenance request"} />
            <Reportmainance />
        </div>
    );
};

export default ReportPage;
