import React from "react";

const ProductRecommendation = () => {
  return (
    <div className="bg-gradient-to-b from-[#1F2937] to-[#4B5563] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#F9FAFB] mb-6">Product Recommendation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">AI-Powered Insights</h3>
            <p className="text-sm text-[#F9FAFB] mt-2">
              Recommendations based on customer preferences and purchase history.
            </p>
          </div>

          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Trending Products</h3>
            <p className="text-sm text-[#F9FAFB] mt-2">
              Highlight the most popular items across categories.
            </p>
          </div>

          <div className="bg-[#374151] rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#9CA3AF]">Seasonal Picks</h3>
            <p className="text-sm text-[#F9FAFB] mt-2">
              Promote products that align with current trends or seasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendation;
