import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        
        if (!res.ok) {
          throw new Error('Product not found');
        }
        
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.images[0]);
        
        // Set first available size as default if any stock exists
        const availableSizes = data.stock.filter(item => item.quantity > 0);
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0].size);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Get available quantity for selected size
  const getAvailableQuantity = () => {
    if (!product || !selectedSize) return 0;
    const sizeStock = product.stock.find(item => item.size === selectedSize);
    return sizeStock ? sizeStock.quantity : 0;
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div></div>;
  
  if (error) return <div className="text-center text-red-600 p-8">Error: {error}</div>;
  
  if (!product) return <div className="text-center p-8">Product not found</div>;

  // Calculate discount percentage
  const discountPercentage = product.discountPrice && product.price 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4">
        <Link to="/products" className="text-blue-800 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Image Gallery */}
        <div className="flex-1">
          <div>
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-96 rounded-lg shadow-lg object-cover"
            />
          </div>
          {/* Thumbnail Images */}
          <div className="grid grid-cols-5 gap-4 mt-4">
            {product.images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-full h-20 rounded-lg cursor-pointer border object-cover ${
                    selectedImage === img ? "border-blue-900 border-2" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            <span>{product.category}</span>
            {product.subcategory && (
              <>
                <span>›</span>
                <span>{product.subcategory}</span>
              </>
            )}
            {product.subsubcategory && (
              <>
                <span>›</span>
                <span>{product.subsubcategory}</span>
              </>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-2xl font-bold text-blue-800">Rs {product.discountPrice || product.price}</span>
            {product.discountPrice && (
              <>
                <span className="text-gray-400 line-through ml-4">Rs {product.price}</span>
                <span className="text-green-600 ml-4">{discountPercentage}% OFF</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="font-medium text-lg">Description</h3>
            <p className="text-gray-700 mt-1">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="font-medium text-lg">Size</h3>
            <div className="flex flex-wrap gap-4 mt-2">
              {product.stock
                .filter(item => item.quantity > 0)
                .map((stockItem) => (
                  <button
                    key={stockItem._id}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === stockItem.size
                        ? "border-2 border-blue-900 text-blue-900"
                        : "hover:border-blue-800"
                    }`}
                    onClick={() => setSelectedSize(stockItem.size)}
                  >
                    {stockItem.size}
                  </button>
                ))}
            </div>
            {product.stock.filter(item => item.quantity > 0).length === 0 && (
              <p className="text-red-500 mt-2">No sizes available</p>
            )}
          </div>

          {/* Quantity Selector */}
          {selectedSize && getAvailableQuantity() > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-lg">Quantity</h3>
              <div className="flex items-center mt-2">
                <button
                  className="px-4 py-2 border hover:bg-gray-100"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6">{quantity}</span>
                <button
                  className="px-4 py-2 border hover:bg-gray-100"
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= getAvailableQuantity()}
                >
                  +
                </button>
                <span className="text-gray-500 ml-4">
                  {getAvailableQuantity()} available
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button 
              className={`px-6 py-3 ${
                selectedSize && getAvailableQuantity() > 0
                  ? "bg-blue-800 text-white hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed"
              } font-medium rounded-lg shadow transition`}
              disabled={!selectedSize || getAvailableQuantity() === 0}
            >
              Add to Cart
            </button>
            <button className="px-6 py-3 border border-blue-800 text-blue-800 font-medium rounded-lg shadow hover:bg-blue-50 transition">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs Section */}
      <div className="mt-12 border-t pt-8">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className="py-2 px-4 border-b-2 border-blue-800 text-blue-800 font-medium">
              Product Details
            </button>
            <button className="py-2 px-4 text-gray-600 hover:text-blue-800">
              Reviews
            </button>
            <button className="py-2 px-4 text-gray-600 hover:text-blue-800">
              Shipping & Returns
            </button>
          </div>
        </div>
        <div className="py-6">
          <p className="text-gray-700">{product.description}</p>
          
          {/* Additional product details can be added here */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium">Category</h4>
              <p>{product.category}</p>
            </div>
            {product.subcategory && (
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium">Subcategory</h4>
                <p>{product.subcategory}</p>
              </div>
            )}
            {product.subsubcategory && (
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium">Type</h4>
                <p>{product.subsubcategory}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;