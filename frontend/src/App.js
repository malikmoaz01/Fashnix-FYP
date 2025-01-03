import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <div className="flex cursor-auto">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product_management" element={<ProductManagement />} />
            <Route path="/order_management" element={<OrderManagement />} />
            <Route path="/user_management" element={<UserManagement />} />
            <Route path="/sales_reports" element={<SalesReports />} />
            <Route path="/discount_management" element={<DiscountManagement />} />
            <Route path="/product_recommendation" element={<ProductRecommendation />} />
            <Route path="/shipping_management" element={<ShippingManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
