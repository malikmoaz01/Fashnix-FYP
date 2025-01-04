import React, { useState, useEffect } from "react";
import womenDressImg from "../../assets/Sneakers.jpg"; // Your image

const SaleComponent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const products = new Array(9).fill({
    id: 1,
    image: womenDressImg,
    name: "Sneakers",
    price: 5000,
    originalPrice: 7500,
    discount: "33% OFF",
    rating: 4.8,
    reviews: 42,
    material: "Synthetic",
    availableSizes: ["M", "L", "XL"],
    stock: 7,
    color: "White",
  });

  // Countdown Timer Logic
  useEffect(() => {
    const countdownDate = new Date().getTime() + 3600000; // 1 hour from now

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Flash Sale Title and Timer */}
      <div className="flex justify-between items-center mb-4">
        {/* Flash Sale Text */}
        <div className="text-5xl font-semibold text-blue-700 animate-blink">
          🔥 Flash Sale
        </div>

        {/* Countdown Timer */}
        <div className="text-center text-pink-500 text-2xl font-poppins font-extrabold shadow-lg rounded-xl p-6 bg-white">
          <h1>{timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</h1>
        </div>
      </div>

      {/* Flash Sale Timer Animation (Blinking) */}
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-blink {
          animation: blink 1s linear infinite;
        }
      `}</style>

      {/* Infinite Product Carousel */}
      <div className="overflow-hidden my-4">
        <div className="flex animate-marquee">
          {products.map((product, index) => (
            <div
              key={product.id + index}
              className="flex-none w-64 bg-white p-4 rounded-lg shadow-md mx-2 mb-4 transition-all ease-in-out"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover rounded-lg"
              />
              <div className="text-center mt-2">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-gray-500">{product.material}</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-xl text-red-600 font-semibold">
                    Rs {product.price}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    Rs {product.originalPrice}
                  </span>
                  <span className="text-sm text-3xl text-green-500">{product.discount}</span>
                </div>
                <div className="flex justify-center items-center my-2">
                  <span className="text-yellow-400">{product.rating} ★</span>
                  <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex justify-center my-4">
                <button className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Flash Sale Products Button */}
      <div className="flex justify-center my-6">
        <button className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition">
          View All Flash Sale Products
        </button>
      </div>
    </div>
  );
};

export default SaleComponent;
