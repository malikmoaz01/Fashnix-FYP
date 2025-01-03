import React from "react";

const Settings = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">General Settings</h3>
            <p className="text-sm text-[#F9FAFB] mt-2">
              Manage website logo, name, and other general configurations.
            </p>
          </div>

          {/* Payment Settings */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Payment Settings</h3>
            <p className="text-sm text-[#F9FAFB] mt-2">
              Configure payment gateways and integrate with third-party providers.
            </p>
          </div>

          {/* Email/SMS Notifications */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Email/SMS Notifications</h3>
            <p className="text-sm text-[#F9FAFB] mt-2">
              Customize notification settings for user communications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
