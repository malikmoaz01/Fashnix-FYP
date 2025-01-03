import React from "react";

const UserManagement = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">User Management</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* View Users */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">View Users</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View details of all registered users</p>
          </div>

          {/* Manage Roles */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Manage Roles</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Assign or change roles for users</p>
          </div>

          {/* Block/Unblock Users */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Block/Unblock Users</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Block or unblock users as needed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
