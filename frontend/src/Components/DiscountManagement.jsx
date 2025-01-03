import React from "react";

const DiscountManagement = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Discount Management</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Discount */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Create Discount</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Create new discount offers</p>
          </div>

          {/* Manage Discounts */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Manage Discounts</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View and manage active discounts</p>
          </div>

          {/* Discount History */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Discount History</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Review past discount campaigns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountManagement;
