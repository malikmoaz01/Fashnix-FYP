import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = async () => {
      try {
        setLoading(true);
        
        // Get cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Fetch product details for each cart item
        const productDetails = {};
        
        for (const item of storedCart) {
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
        setCartItems(storedCart);
        setLoading(false);
      } catch (err) {
        console.error('Error loading cart:', err);
        toast.error('Failed to load cart items');
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const updateQuantity = (productId, size, newQuantity) => {
    // Find the item in cart
    const updatedCart = cartItems.map(item => {
      if (item.productId === productId && item.size === size) {
        return { ...item, quantity: Math.max(newQuantity, 1) };
      }
      return item;
    });
    
    // Update state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Cart updated!');
  };

  const removeItem = (productId, size) => {
    // Filter out the item to remove
    const updatedCart = cartItems.filter(
      item => !(item.productId === productId && item.size === size)
    );
    
    // Update state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart!');
  };

  // Calculate subtotal based on actual product prices
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products[item.productId];
      if (!product) return sum;
      
      const price = product.discountPrice || product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="p-8 border border-gray-200 rounded-md">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/products">
            <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => {
            const product = products[item.productId];
            if (!product) return null; // Skip if product details not available
            
            return (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex flex-col md:flex-row items-center justify-between border border-blue-800 rounded-md p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images && product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div>
                    <h2 className="font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-600">
                      Size: {item.size || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.discountPrice && (
                        <span className="text-green-600">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="text-right">
                    {product.discountPrice && (
                      <p className="text-gray-500 line-through text-sm">
                        Rs {product.price}
                      </p>
                    )}
                    <p className="text-lg font-bold">
                      Rs {product.discountPrice || product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="p-2 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-2 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-red-500"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Section */}
        <div className="w-full md:w-1/3 border border-blue-900 rounded-md p-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between border-b py-2">
            <span>Subtotal</span>
            <span>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold py-2">
            <span>Total</span>
            <span>Rs {subtotal}</span>
          </div>
          <Link to="/checkout">
            <button className="bg-blue-900 text-white w-full py-2 rounded-md mt-4 hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;