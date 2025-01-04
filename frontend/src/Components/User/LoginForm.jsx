import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Blinking effect container */}
        <div className="absolute -inset-1 rounded-lg animate-blink border-2 border-blue-700 pointer-events-none"></div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white-900 bg-white border border-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full text-gray-900 bg-white border border-blue-900 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Continue with Google
          </button>
          <p className="text-sm font-light text-gray-500">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={() => navigate("/signup")}
              className="font-medium text-blue-900 hover:underline"
            >
              Sign up here
            </a>
          </p>
        </form>
      </div>
      <style>
        {`
          @keyframes blink {
            0%, 100% {
              box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.8);
            }
            50% {
              box-shadow: 0 0 20px 5px rgba(59, 130, 246, 1);
            }
          }
          .animate-blink {
            animation: blink 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;
