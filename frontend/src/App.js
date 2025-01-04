import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Admin components (uncommented now)
import Header from './Components/Admin/Header';
import Sidebar from './Components/Admin/Sidebar';
import Dashboard from './Components/Admin/Dashboard';
import ProductManagement from './Components/Admin/ProductManagement';
import OrderManagement from './Components/Admin/OrderManagement';
import UserManagement from './Components/Admin/UserManagement';
import SalesReports from './Components/Admin/SalesReports';
import DiscountManagement from './Components/Admin/DiscountManagement';
import ProductRecommendation from './Components/Admin/ProductRecommendation';
import ShippingManagement from './Components/Admin/ShippingManagement';
import Settings from './Components/Admin/Settings';
import Adminlogin from './Components/Admin/AdminLogin';

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
            {/* Admin routes */}
            <Route path="/admin/login" element={<Adminlogin onLogin={handleLogin} />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/product_management" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
            <Route path="/admin/order_management" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
            <Route path="/admin/user_management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/sales_reports" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} />
            <Route path="/admin/discount_management" element={<ProtectedRoute><DiscountManagement /></ProtectedRoute>} />
            <Route path="/admin/product_recommendation" element={<ProtectedRoute><ProductRecommendation /></ProtectedRoute>} />
            <Route path="/admin/shipping_management" element={<ProtectedRoute><ShippingManagement /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;


// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './Components/User/Header';
// import Navbar from './Components/User/Navbar';
// import CategoriesDropdown from './Components/User/CategoriesDropdown';
// import Signup from './Components/User/SignupForm';
// import Login from './Components/User/LoginForm';

// // Categories Images & Routes 
// import Shirts from './Components/User/Menswear/Shirts';
// import TShirts from './Components/User/Menswear/TShirt';
// import Jeans from './Components/User/Menswear/Jeans';
// import Jackets from './Components/User/Menswear/Jackets';
// import Dresses from './Components/User/Womenswear/Dresses';
// import Tops from './Components/User/Womenswear/Tops';
// import Skirts from './Components/User/Womenswear/Skirts';
// import Sarees from './Components/User/Womenswear/Sarees';
// import KidsTShirts from './Components/User/Kidswear/TShirts';
// import Shorts from './Components/User/Kidswear/Shorts';
// import KidsDresses from './Components/User/Kidswear/Dresses';
// import Nightwear from './Components/User/Kidswear/Nightwear';
// import Bags from './Components/User/Accessories/Bags';
// import Shoes from './Components/User/Accessories/Shoes';
// import Watches from './Components/User/Accessories/Watches';
// import Jewelry from './Components/User/Accessories/Jewelry';
// import About from './Components/User/About';
// import Footer from './Components/User/Footer';
// import Home from './Components/User/Home';

// const App = () => {
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     const handleNavigate = () => {
//         setDropdownOpen(false);
//     };

//     return (
//         <Router>
//             <div>
//                 {/* Header and Navbar */}
//                 <Header />
//                 <Navbar onToggleDropdown={() => setDropdownOpen(!dropdownOpen)} />
//                 {/* Dropdown for categories */}
//                 {dropdownOpen && <CategoriesDropdown onNavigate={handleNavigate} />}

//                 <main>
//                     <Routes>
//                         <Route path="/" element={<Home />} />
//                         <Route path="/about-us" element={<About />} />
//                         <Route path="/signup" element={<Signup />} />
//                         <Route path="/login" element={<Login />} />

//                         {/* Menswear */}
//                         <Route path="/menswear/shirts" element={<Shirts />} />
//                         <Route path="/menswear/tshirts" element={<TShirts />} />
//                         <Route path="/menswear/jeans" element={<Jeans />} />
//                         <Route path="/menswear/jackets" element={<Jackets />} />

//                         {/* Womenswear */}
//                         <Route path="/womenswear/dresses" element={<Dresses />} />
//                         <Route path="/womenswear/tops" element={<Tops />} />
//                         <Route path="/womenswear/skirts" element={<Skirts />} />
//                         <Route path="/womenswear/sarees" element={<Sarees />} />

//                         {/* Kidswear */}
//                         <Route path="/kidswear/tshirts" element={<KidsTShirts />} />
//                         <Route path="/kidswear/shorts" element={<Shorts />} />
//                         <Route path="/kidswear/dresses" element={<KidsDresses />} />
//                         <Route path="/kidswear/nightwear" element={<Nightwear />} />

//                         {/* Accessories */}
//                         <Route path="/accessories/bags" element={<Bags />} />
//                         <Route path="/accessories/shoes" element={<Shoes />} />
//                         <Route path="/accessories/watches" element={<Watches />} />
//                         <Route path="/accessories/jewelry" element={<Jewelry />} />
//                     </Routes>
//                 </main>

//                 {/* Footer */}
//                 <Footer />
            
//             </div>
//         </Router>
//     );
// };

// export default App;
