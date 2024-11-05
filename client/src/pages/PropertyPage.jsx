import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Header from "../components/common/Header";
import TableWithActions from "../components/property/ProperyTable";




const Contactors = () => {
  return (
    <div className="flex-1 relative z-10 overflow-y-auto h-screen p-4">
      <TableWithActions />
    </div>
  );
};

export default Contactors;
