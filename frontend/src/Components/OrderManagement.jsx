import React from "react";

const OrderManagement = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Order Management</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* View All Orders */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">View All Orders</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">See all orders placed</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Pending Orders</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View orders that are yet to be processed</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Completed Orders</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View successfully processed orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
