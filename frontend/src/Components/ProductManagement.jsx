import React from "react";

const ProductManagement = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Product Management</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Product */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Add New Product</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Add a new product to your catalog</p>
          </div>

          {/* Manage Products */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Manage Products</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">View and manage existing products</p>
          </div>

          {/* Edit, Delete, View Products */}
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Edit, Delete, View Products</h3>
            <p className="text-2xl font-bold text-[#F9FAFB] mt-2">Edit, delete, or view product details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
