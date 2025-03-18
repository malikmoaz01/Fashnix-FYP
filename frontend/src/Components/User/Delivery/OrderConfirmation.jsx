import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

const OrderConfirmation = ({ orderId, customerEmail }) => {
  useEffect(() => {
    // Launch confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-6">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. We're preparing your order now.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 inline-block mx-auto text-left">
        <div className="mb-4">
          <span className="text-gray-600 text-sm">Order Number:</span>
          <p className="font-bold">{orderId}</p>
        </div>
        <div>
          <span className="text-gray-600 text-sm">Confirmation Email:</span>
          <p>{customerEmail}</p>
          <p className="text-xs text-gray-500 mt-1">
            A copy of your receipt has been sent to this email address.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">What's Next?</h3>
          <p className="text-sm text-gray-600">
            We'll send you shipping confirmation when your order is on the way! You can
            track the status of your order at any time in your account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to="/account/orders"
            className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition text-center flex-1"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition text-center flex-1"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;