import React from "react";

const ReportsAnalytics = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Reports & Analytics</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Reports */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Sales Reports</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View detailed sales data</p>
          </div>

          {/* User Activities */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">User Activities</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Track user activity across the platform</p>
          </div>

          {/* Revenue Analytics */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Revenue Analytics</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View detailed revenue trends</p>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6 col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Low Stock Alerts</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View products with low stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
