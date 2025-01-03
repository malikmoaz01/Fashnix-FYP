import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import ProductManagement from './Components/ProductManagement';
import OrderManagement from './Components/OrderManagement';
import UserManagement from './Components/UserManagement';
import SalesReports from './Components/SalesReports';
import DiscountManagement from './Components/DiscountManagement';
import ProductRecommendation from './Components/ProductRecommendation';
import ShippingManagement from './Components/ShippingManagement';
import Settings from './Components/Settings';
import Adminlogin from './Components/Adminlogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const adminCredentials = {
    username: 'admin',
    password: '123',
  };

  const handleLogin = (username, password) => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <div className="flex cursor-auto">
        {isAuthenticated && <Sidebar />}
        <div className="flex flex-1 flex-col">
          {isAuthenticated && <Header onLogout={handleLogout} />}
          <Routes>
            <Route path="/login" element={<Adminlogin onLogin={handleLogin} />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/product_management" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
            <Route path="/order_management" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
            <Route path="/user_management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/sales_reports" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} />
            <Route path="/discount_management" element={<ProtectedRoute><DiscountManagement /></ProtectedRoute>} />
            <Route path="/product_recommendation" element={<ProtectedRoute><ProductRecommendation /></ProtectedRoute>} />
            <Route path="/shipping_management" element={<ProtectedRoute><ShippingManagement /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
