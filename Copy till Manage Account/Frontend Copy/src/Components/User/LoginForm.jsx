import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  // Check user from localStorage on mount
  useEffect(() => {
    // Clear any existing user data first to prevent automatic login
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // If user is blocked, clear storage and show message
        if (parsedUser.isBlocked === true) {
          setIsBlocked(true);
          localStorage.removeItem("user");
          return;
        }
        
        // Only set user and navigate if not blocked
        setUser(parsedUser);
        navigate("/");
      }
    };
    
    checkStoredUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsBlocked(false);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // CRITICAL: Check if user is blocked before proceeding
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        // Clear any existing user data to prevent auto-login
        localStorage.removeItem("user");
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed!");
        return;
      }

      // Double-check isBlocked flag again to be extra safe
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        return;
      }

      // Only proceed with login if user is not blocked
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch storage updated event for Navbar to detect
      window.dispatchEvent(new Event('storageUpdated'));

      // Navigate to home/dashboard
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };
  
  const handleGoogleLogin = async (credentialResponse) => {
    setErrorMessage("");
    setIsBlocked(false);
    
    try {
      // Decode the credential to get user info
      const decodedToken = jwtDecode(credentialResponse.credential);
      
      // Send Google token to your backend
      const response = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          googleToken: credentialResponse.credential,
          email: decodedToken.email,
          name: decodedToken.name,
          profileImage: decodedToken.picture
        }),
      });

      const data = await response.json();

      // CRITICAL: Check if user is blocked before proceeding
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        // Clear any existing user data
        localStorage.removeItem("user");
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.message || "Google login failed!");
        return;
      }

      // Double-check isBlocked flag again to be extra safe
      if (data.user && data.user.isBlocked === true) {
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        return;
      }

      // Only proceed with login if user is not blocked
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch storage updated event for Navbar to detect
      window.dispatchEvent(new Event('storageUpdated'));

      // Navigate to home/dashboard
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("Something went wrong with Google login. Please try again later.");
    }
  };

  // Function to check for blocked users that might still be in localStorage
  const checkAndClearBlockedUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.isBlocked === true) {
        localStorage.removeItem("user");
        setIsBlocked(true);
        setErrorMessage("Your account has been blocked due to excessive order cancellations. Please contact admin.");
        return true;
      }
    }
    return false;
  };

  // Call this function on component mount
  useEffect(() => {
    checkAndClearBlockedUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-10">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10">
        {/* Blinking effect container */}
        <div className="absolute -inset-1 rounded-lg animate-blink border-2 border-blue-700 pointer-events-none"></div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Login
        </h1>

        {/* Blocked user message */}
        {isBlocked && (
          <div className="mb-4 p-4 text-white bg-red-600 rounded-lg">
            <p className="font-bold mb-1">Account Blocked</p>
            <p>You cannot log in because you've cancelled more than 5 orders in the past month.</p>
            <p className="mt-2">Please contact admin to restore your account access.</p>
          </div>
        )}

        {/* General error message */}
        {errorMessage && !isBlocked && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm sm:text-base font-medium text-gray-900"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-700 focus:border-blue-700 block w-full p-2 sm:p-2.5"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm sm:text-base font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-700 focus:border-blue-700 block w-full p-2 sm:p-2.5"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center"
          >
            Login
          </button>

          {/* Google Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              clientId="123922841654-i1jujo69c525uji333d5q2v8rksq5est.apps.googleusercontent.com"
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.error('Google Login Failed');
                setErrorMessage("Google login failed. Please try again.");
              }}
              useOneTap={true}
              theme="filled_blue"
              text="continue_with"
              shape="rectangular"
              locale="en"
              logo_alignment="center"
            />
          </div>

          {/* Link to signup */}
          <p className="text-sm font-light text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium text-blue-700 hover:underline"
            >
              Sign up here
            </button>
          </p>
        </form>
      </div>

      {/* Styles for blinking effect */}
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