import React from "react";

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Overview</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Total Users</h3>
            <p className="text-3xl font-bold text-[#F9FAFB] mt-2">1,234</p>
          </div>

          {/* Total Orders */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Total Orders</h3>
            <p className="text-3xl font-bold text-[#F9FAFB] mt-2">567</p>
          </div>

          {/* Sales Stats */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Sales Stats</h3>
            <p className="text-3xl font-bold text-[#F9FAFB] mt-2">$12,345</p>
          </div>

          {/* Products in Stock */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Products in Stock</h3>
            <p className="text-3xl font-bold text-[#F9FAFB] mt-2">123</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6 col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Pending Orders</h3>
            <p className="text-3xl font-bold text-[#F9FAFB] mt-2">45</p>
          </div>
        </div>

        {/* Additional Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">Recent Activity</h3>
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <p className="text-[#9CA3AF]">No recent activities to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
