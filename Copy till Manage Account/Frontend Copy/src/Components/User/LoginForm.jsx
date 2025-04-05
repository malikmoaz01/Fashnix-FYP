import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode }  from "jwt-decode";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Local user state
  const navigate = useNavigate();

  // Check user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed!");
      } else {
        // Successful login
        alert(data.message);

        // Save user data to state + localStorage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Dispatch storage updated event for Navbar to detect
        window.dispatchEvent(new Event('storageUpdated'));

        // Navigate to home/dashboard
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Decode the credential to get user info
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", decodedToken);
      
      // Send Google token to your backend
      const response = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          googleToken: credentialResponse.credential,
          email: decodedToken.email,
          name: decodedToken.name,
          profileImage: decodedToken.picture // Match your schema field name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Google login failed!");
      } else {
        // Successful login
        alert("Successfully logged in with Google!");

        // Save user data to state + localStorage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Dispatch storage updated event for Navbar to detect
        window.dispatchEvent(new Event('storageUpdated'));

        // Navigate to home/dashboard
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Something went wrong with Google login. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-10">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10">
        {/* Blinking effect container */}
        <div className="absolute -inset-1 rounded-lg animate-blink border-2 border-blue-700 pointer-events-none"></div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Login
        </h1>

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
                alert("Google login failed. Please try again.");
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