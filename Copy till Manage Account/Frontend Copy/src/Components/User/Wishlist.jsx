import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist items from localStorage
    const loadWishlistItems = async () => {
      try {
        setLoading(true);
        
        // Get wishlist items from localStorage
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Fetch product details for each wishlist item
        const productDetails = {};
        
        for (const item of storedWishlist) {
          // Only fetch if we don't already have the details
          if (!productDetails[item.productId]) {
            try {
              const res = await fetch(`http://localhost:5000/api/products/${item.productId}`);
              if (res.ok) {
                const data = await res.json();
                productDetails[item.productId] = data;
              } else {
                console.error(`Failed to fetch product ${item.productId}`);
              }
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
            }
          }
        }
        
        setProducts(productDetails);
        setWishlistItems(storedWishlist);
        setLoading(false);
      } catch (err) {
        console.error('Error loading wishlist:', err);
        toast.error('Failed to load wishlist items');
        setLoading(false);
      }
    };

    loadWishlistItems();
  }, []);

  const removeFromWishlist = (productId) => {
    // Filter out the item to remove
    const updatedWishlist = wishlistItems.filter(
      item => item.productId !== productId
    );
    
    // Update state and localStorage
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Dispatch custom event to notify header
    window.dispatchEvent(new Event('storageUpdated'));
    
    toast.success('Item removed from wishlist!');
  };

  const addToCart = (productId) => {
    try {
      // Get product details
      const product = products[productId];
      if (!product) {
        toast.error('Product not found');
        return;
      }
      
      // Get current cart
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Find the wishlist item
      const wishlistItem = wishlistItems.find(item => item.productId === productId);
      
      // Check if the item already exists in the cart
      const existingCartItemIndex = currentCart.findIndex(
        item => item.productId === productId && item.size === (wishlistItem.size || 'default')
      );
      
      if (existingCartItemIndex >= 0) {
        // Update quantity if item exists
        currentCart[existingCartItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        currentCart.push({
          productId,
          quantity: 1,
          size: wishlistItem.size || 'default'
        });
      }
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      // Dispatch custom event to notify header
      window.dispatchEvent(new Event('storageUpdated'));
      
      toast.success('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
        <div className="p-8 border border-gray-200 rounded-md">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <Link to="/products">
            <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Explore Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const product = products[item.productId];
          if (!product) return null; // Skip if product details not available
          
          return (
            <div
              key={item.productId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                
                {product.discountPrice && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="font-bold text-lg mb-1">{product.name}</h2>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">Rs {product.discountPrice}</span>
                        <span className="text-gray-500 line-through text-sm">Rs {product.price}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">Rs {product.price}</span>
                    )}
                  </div>
                  
                  {item.size && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                  )}
                </div>
                
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => addToCart(item.productId)}
                    className="bg-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition flex-1 mr-2"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;