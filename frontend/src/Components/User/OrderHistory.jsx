import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MinePic from "../../assets/TeamLeader.jpg";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Function to retrieve the user data from local storage
    const getUserAuth = () => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            return null;
        }
        try {
            return JSON.parse(userString);
        } catch (e) {
            console.error("Error parsing user data from localStorage", e);
            return null;
        }
    };

    // Format date for better readability
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        const fetchUserOrders = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserAuth();
            if (!userData) {
                setError("You are not logged in. Please log in to view your orders.");
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/user/email/${userData.email}`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user orders:", error);
                setError("Failed to load orders. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchUserOrders();
    }, []);

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    if (loading && orders.length === 0) {
        return <div className="flex justify-center items-center h-screen">Loading orders...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative bg-gray-50">
            {/* Sidebar Overlay (Click anywhere to close) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Toggle Button for Mobile */}
            <button
                className="md:hidden bg-blue-900 text-white py-2 px-4 m-2 rounded z-50"
                onClick={() => setSidebarOpen(true)}
            >
                ☰ Menu
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-white w-64 md:w-1/4 p-4 shadow-lg fixed md:relative h-full z-50 transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                    <img 
                        src={getUserAuth()?.profileImage || MinePic} 
                        alt="User Avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-semibold">My Account</h2>
                    </div>
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li><Link to="/account" className="block py-2 px-4 rounded hover:bg-gray-200">Manage Account</Link></li>
                        <li><Link to="/order-history" className="block py-2 px-4 rounded bg-blue-100 font-semibold">My Order History</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 transition-all duration-300">
                <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">My Order History</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {orders.length === 0 && !loading ? (
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <Link to="/shop" className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {/* Order Cards */}
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-white p-4 rounded-lg shadow border hover:border-blue-900 transition">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">Order #{order.orderId}</h2>
                                        <p className="text-gray-600 mb-1">Placed on: {formatDate(order.createdAt)}</p>
                                        <p className="text-gray-600 mb-2">Total: Rs{order.total.toFixed(2)}</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <button 
                                            className="py-2 px-4 bg-blue-900 text-white rounded hover:bg-blue-800"
                                            onClick={() => viewOrderDetails(order)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <h2 className="text-xl font-semibold">Order Details #{selectedOrder.orderId}</h2>
                                    <button 
                                        onClick={closeOrderDetails}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6 mt-4">
                                    {/* Order Info */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Order Information</h3>
                                        <p className="mb-1"><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                                        <p className="mb-1"><span className="font-medium">Status:</span> 
                                            <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedOrder.status)}`}>
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                        </p>
                                        {selectedOrder.delivery?.trackingNumber && (
                                            <p className="mb-1"><span className="font-medium">Tracking #:</span> {selectedOrder.delivery.trackingNumber}</p>
                                        )}
                                        {selectedOrder.delivery?.estimatedDelivery && (
                                            <p className="mb-1"><span className="font-medium">Est. Delivery:</span> {formatDate(selectedOrder.delivery.estimatedDelivery)}</p>
                                        )}
                                        {selectedOrder.delivery?.carrier && (
                                            <p className="mb-1"><span className="font-medium">Carrier:</span> {selectedOrder.delivery.carrier}</p>
                                        )}
                                    </div>
                                    
                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                                        <p className="mb-1">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                        <p className="mb-1">{selectedOrder.customer.address?.line1}</p>
                                        {selectedOrder.customer.address?.line2 && (
                                            <p className="mb-1">{selectedOrder.customer.address.line2}</p>
                                        )}
                                        <p className="mb-1">
                                            {selectedOrder.customer.address?.city}, {selectedOrder.customer.address?.state} {selectedOrder.customer.address?.postalCode}
                                        </p>
                                        <p className="mb-1">{selectedOrder.customer.address?.country}</p>
                                    </div>
                                </div>
                                
                                {/* Order Items */}
                                <div className="mt-6">
                                    <h3 className="font-semibold text-lg mb-2">Order Items</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="py-2 px-4 text-left">Item</th>
                                                    <th className="py-2 px-4 text-right">Quantity</th>
                                                    <th className="py-2 px-4 text-right">Price</th>
                                                    <th className="py-2 px-4 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.items.map((item, index) => (
                                                    <tr key={index} className="border-t">
                                                        <td className="py-2 px-4">
                                                            <div className="flex items-center">
                                                                {item.image && (
                                                                    <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover mr-3" />
                                                                )}
                                                                <div>
                                                                    <p>{item.productName}</p>
                                                                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-4 text-right">{item.quantity}</td>
                                                        <td className="py-2 px-4 text-right">Rs {item.price.toFixed(2)}</td>
                                                        <td className="py-2 px-4 text-right">Rs {(item.price * item.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t">
                                                    <td colSpan="3" className="py-2 px-4 text-right font-medium">Subtotal:</td>
                                                    <td className="py-2 px-4 text-right">Rs {selectedOrder.subtotal?.toFixed(2) || (selectedOrder.total - (selectedOrder.deliveryCost || 0)).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3" className="py-2 px-4 text-right font-medium">Shipping:</td>
                                                    <td className="py-2 px-4 text-right">Rs {selectedOrder.deliveryCost?.toFixed(2) || "0.00"}</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td colSpan="3" className="py-2 px-4 text-right font-semibold">Total:</td>
                                                    <td className="py-2 px-4 text-right font-semibold">Rs {selectedOrder.total.toFixed(2)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Payment Information */}
                                <div className="mt-6">
                                    <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
                                    <p className="mb-1">
                                        <span className="font-medium">Payment Method:</span> {
                                            selectedOrder.payment?.method === 'cod' 
                                                ? 'Cash on Delivery' 
                                                : 'Credit Card'
                                        }
                                    </p>
                                    <p className="mb-1">
                                        <span className="font-medium">Payment Status:</span> {
                                            selectedOrder.payment?.status.charAt(0).toUpperCase() + 
                                            selectedOrder.payment?.status.slice(1)
                                        }
                                    </p>
                                </div>
                                
                                {/* Status History */}
                                {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold text-lg mb-2">Order Status History</h3>
                                        <ul className="space-y-2">
                                            {selectedOrder.statusHistory.map((history, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className={`mr-3 mt-1 w-3 h-3 rounded-full ${getStatusBadgeColor(history.status)}`}></div>
                                                    <div>
                                                        <p className="font-medium">{history.status.charAt(0).toUpperCase() + history.status.slice(1)}</p>
                                                        <p className="text-sm text-gray-600">{formatDate(history.timestamp)} {new Date(history.timestamp).toLocaleTimeString()}</p>
                                                        {history.comment && <p className="text-sm">{history.comment}</p>}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="flex justify-end mt-6 pt-4 border-t">
                                    <button
                                        onClick={closeOrderDetails}
                                        className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 mr-2"
                                    >
                                        Close
                                    </button>
                                    {selectedOrder.status === "delivered" && (
                                        <button className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800">
                                            Write Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderHistory;