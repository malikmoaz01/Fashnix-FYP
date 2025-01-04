import React from 'react';
import womenDressImg from '../../assets/Sneakers.jpg'; // Replacing with your image import

const Recommended = () => {
  const products = [
    {
      id: 1,
      image: womenDressImg,
      name: 'Women\'s Dress',
      price: 4500, // Price in PKR
      originalPrice: 10000, // Original price in PKR
      discount: 'Save 25% Now!',
      rating: 4.5,
      reviews: 38,
      material: 'Cotton',
      availableSizes: ['S', 'M', 'L', 'XL'],
      stock: 5,
      color: 'Red',
    },
    {
      id: 2,
      image: womenDressImg,
      name: 'Casual T-Shirt',
      price: 2000,
      originalPrice: 4000,
      discount: 'Limited Time Offer - 50% OFF',
      rating: 4.0,
      reviews: 25,
      material: 'Polyester',
      availableSizes: ['M', 'L', 'XL'],
      stock: 3,
      color: 'Blue',
    },
    {
      id: 3,
      image: womenDressImg,
      name: 'Summer Skirt',
      price: 3000,
      originalPrice: 6000,
      discount: '30% OFF',
      rating: 5.0,
      reviews: 50,
      material: 'Linen',
      availableSizes: ['S', 'M', 'L'],
      stock: 10,
      color: 'Green',
    },
    {
      id: 4,
      image: womenDressImg,
      name: 'Sweater Dress',
      price: 5000,
      originalPrice: 7500,
      discount: '33% OFF',
      rating: 4.8,
      reviews: 42,
      material: 'Wool',
      availableSizes: ['M', 'L', 'XL'],
      stock: 7,
      color: 'Black',
    },
  ];

  return (
    <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-5 pb-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col shadow-lg rounded-lg overflow-hidden group">
          {/* Product Image with Hover Overlay */}
          <div className="relative group">
            <img
              className="h-auto w-full object-cover"
              src={product.image}
              alt={`${product.name} image`}
            />
            {/* Hover Buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <a
                href="product-overview.html"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </a>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-2 right-2 bg-pink-400 px-2 py-1 text-xs font-semibold">
              {product.discount}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <p className="text-sm font-medium text-gray-700">{product.name}</p>
            <p className="mt-1 text-lg font-bold text-blue-900">
              Rs. {product.price.toFixed(0)}{' '}
              <span className="text-sm font-normal text-gray-400 line-through">
                Rs. {product.originalPrice.toFixed(0)}
              </span>
            </p>

            {/* Stock Alert */}
            {product.stock < 5 && (
              <p className="mt-1 text-sm text-red-600 font-medium animate-pulse">
                Hurry, only {product.stock} left!
              </p>
            )}

            {/* Additional Product Info */}
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Material:</strong> {product.material}</p>
              <p><strong>Available Sizes:</strong> {product.availableSizes.join(', ')}</p>
              <p><strong>Color:</strong> {product.color}</p>
            </div>

            {/* Ratings */}
            <div className="mt-2 flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
              <p className="ml-1 text-sm text-gray-500">({product.reviews})</p>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-4 w-full bg-blue-900 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 rounded-full">
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Recommended;
