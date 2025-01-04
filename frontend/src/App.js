// import React, { useState } from 'react';
// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import './App.css';
// import HomePage from './Components/User/HomePage';
// import Footer from './Components/User/Footer';
// import SignupForm from './Components/User/SignupForm';
// import LoginForm from './Components/User/LoginForm';

// // Commented-out Admin components (you can uncomment them when needed)
// // import Header from './Components/Admin/Header';
// // import Sidebar from './Components/Admin/Sidebar';
// // import Dashboard from './Components/Admin/Dashboard';
// // import ProductManagement from './Components/Admin/ProductManagement';
// // import OrderManagement from './Components/Admin/OrderManagement';
// // import UserManagement from './Components/Admin/UserManagement';
// // import SalesReports from './Components/Admin/SalesReports';
// // import DiscountManagement from './Components/Admin/DiscountManagement';
// // import ProductRecommendation from './Components/Admin/ProductRecommendation';
// // import ShippingManagement from './Components/Admin/ShippingManagement';
// // import Settings from './Components/Admin/Settings';
// // import Adminlogin from './Components/Admin/Adminlogin';

// function App() {
//   /*
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const adminCredentials = {
//     username: 'admin',
//     password: '123',
//   };

//   const handleLogin = (username, password) => {
//     if (username === adminCredentials.username && password === adminCredentials.password) {
//       setIsAuthenticated(true);
//       return true;
//     }
//     return false;
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//   };

//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" />;
//   };
//   */

//   return (
//     <BrowserRouter>
//       <div className="flex cursor-auto">
//         {/* {isAuthenticated && <Sidebar />} */}
//         <div className="flex flex-1 flex-col">
//           {/* {isAuthenticated && <Header onLogout={handleLogout} />} */}
//           <Routes>
//             {/* Uncomment these routes when the admin panel is ready */}
//             {/* <Route path="/login" element={<Adminlogin onLogin={handleLogin} />} /> */}
//             {/* <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
//             {/* <Route path="/product_management" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} /> */}
//             {/* <Route path="/order_management" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} /> */}
//             {/* <Route path="/user_management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} /> */}
//             {/* <Route path="/sales_reports" element={<ProtectedRoute><SalesReports /></ProtectedRoute>} /> */}
//             {/* <Route path="/discount_management" element={<ProtectedRoute><DiscountManagement /></ProtectedRoute>} /> */}
//             {/* <Route path="/product_recommendation" element={<ProtectedRoute><ProductRecommendation /></ProtectedRoute>} /> */}
//             {/* <Route path="/shipping_management" element={<ProtectedRoute><ShippingManagement /></ProtectedRoute>} /> */}
//             {/* <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="*" element={<Navigate to="/" />} />
//             <Route path='/signup' element={<SignupForm/>}/>
//             <Route path='/login' element={<LoginForm/>}/>
//           </Routes>
//           {/* <Footer /> */}
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/User/Header';
import Navbar from './Components/User/Navbar';
import Signup from './Components/User/SignupForm'; // Replace with your actual Signup component
import Login from './Components/User/LoginForm';   // Replace with your actual Login component

const App = () => {
    return (
        <Router>
            <div>
                {/* Header and Navbar are always visible */}
                <Header />
                <Navbar />

                {/* Conditional rendering for main content */}
                <main>
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
