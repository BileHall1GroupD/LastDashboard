import React from "react";

import Header from "../components/common/Header";
import CityTable from "../components/City/CityTables";

const City = () => {
  return (
    <div className="flex-1 relative z-10 overflow-y-auto h-screen p-4">
      <Header title={"Cities"} />
      <CityTable />
    </div>
  );
};

export default City;
