import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Printer } from "lucide-react";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailVisible, setDetailVisible] = useState({});
    const navigate = useNavigate();

    // Function to retrieve the user ID and token from local storage
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

    // Fetch user orders from backend when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserAuth();
            if (!userData || !userData.id) {
                setError("You are not logged in. Please log in to view your orders.");
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userData.id}/orders`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                
                setOrders(response.data);
                
                // Initialize visibility state for all orders
                const initialVisibility = {};
                response.data.forEach(order => {
                    initialVisibility[order.orderId] = false;
                });
                setDetailVisible(initialVisibility);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, []);

    const toggleDetails = (orderId) => {
        setDetailVisible(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const getStatusColor = (status) => {
        switch(status) {
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
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const printOrder = (order) => {
        const printWindow = window.open('', '_blank');
        
        const hasBillingAddress = order.customer.billingAddress && 
            (order.customer.billingAddress.line1 || 
            !order.customer.billingAddress.sameAsShipping);
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Order #${order.orderId}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .section { margin-bottom: 20px; }
                    .section-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
                    .flex { display: flex; }
                    .flex-col { width: 50%; padding: 10px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .status { display: inline-block; padding: 3px 10px; border-radius: 30px; }
                    .pending { background-color: #FEF9C3; color: #854D0E; }
                    .processing { background-color: #DBEAFE; color: #1E40AF; }
                    .shipped { background-color: #F3E8FF; color: #6B21A8; }
                    .delivered { background-color: #DCFCE7; color: #166534; }
                    .cancelled { background-color: #FEE2E2; color: #991B1B; }
                    .total-row { font-weight: bold; }
                    .footer { margin-top: 30px; font-size: 0.8em; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Order Receipt</h1>
                    <p>Order #${order.orderId}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">Order Information</div>
                    <p>Date: ${formatDate(order.createdAt)}</p>
                    <p>Status: <span class="status ${order.status}">${order.status.toUpperCase()}</span></p>
                    ${order.delivery && order.delivery.trackingNumber ? 
                        `<p>Tracking Number: ${order.delivery.trackingNumber}</p>` : ''}
                </div>
                
                <div class="flex">
                    <div class="flex-col">
                        <div class="section-title">Shipping Address</div>
                        <p>${order.customer.firstName} ${order.customer.lastName}</p>
                        <p>${order.customer.address.line1}</p>
                        ${order.customer.address.line2 ? `<p>${order.customer.address.line2}</p>` : ''}
                        <p>${order.customer.address.city}, ${order.customer.address.state} ${order.customer.address.postalCode}</p>
                        <p>${order.customer.address.country}</p>
                        <p>Phone: ${order.customer.phone}</p>
                    </div>
                    
                    <div class="flex-col">
                        <div class="section-title">Payment Information</div>
                        <p>Method: ${order.payment.method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                        ${order.payment.cardLast4 ? `<p>Card: **** **** **** ${order.payment.cardLast4}</p>` : ''}
                        <p>Status: ${order.payment.status}</p>
                        
                        ${hasBillingAddress ? `
                        <div class="section-title" style="margin-top: 15px;">Billing Address</div>
                        <p>${order.customer.firstName} ${order.customer.lastName}</p>
                        <p>${order.customer.billingAddress.line1 || order.customer.address.line1}</p>
                        ${(order.customer.billingAddress.line2 || order.customer.address.line2) ? 
                            `<p>${order.customer.billingAddress.line2 || order.customer.address.line2}</p>` : ''}
                        <p>${order.customer.billingAddress.city || order.customer.address.city}, 
                           ${order.customer.billingAddress.state || order.customer.address.state} 
                           ${order.customer.billingAddress.postalCode || order.customer.address.postalCode}</p>
                        <p>${order.customer.billingAddress.country || order.customer.address.country}</p>
                        ` : ''}
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Order Items</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.size || 'N/A'}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                            <tr>
                                <td colspan="4" style="text-align: right;">Subtotal:</td>
                                <td>$${order.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="4" style="text-align: right;">Shipping:</td>
                                <td>$${order.deliveryCost.toFixed(2)}</td>
                            </tr>
                            <tr class="total-row">
                                <td colspan="4" style="text-align: right;">Total:</td>
                                <td>$${order.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="footer">
                    <p>Thank you for your order!</p>
                    <p>If you have any questions, please contact our customer service.</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading orders...</div>;
    }

    if (error && orders.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800"
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gray-50">
            <h1 className="text-2xl font-semibold mb-6 text-center md:text-left">My Order History</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-lg text-gray-600">You don't have any orders yet.</p>
                    <button 
                        className="mt-4 bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
                        onClick={() => navigate('/products')}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden border hover:border-blue-900">
                            {/* Order Header */}
                            <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                <div>
                                    <p className="text-lg font-medium">Order #{order.orderId}</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    
                                    <button 
                                        onClick={() => printOrder(order)}
                                        className="flex items-center gap-1 text-blue-900 hover:text-blue-700"
                                    >
                                        <Printer size={16} />
                                        <span>Print</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => toggleDetails(order.orderId)}
                                        className="text-blue-900 hover:text-blue-700"
                                    >
                                        {detailVisible[order.orderId] ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Order Summary (always visible) */}
                            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between">
                                <div>
                                    <p className="font-medium">Items: {order.items.length}</p>
                                    <p>Total: ${order.total.toFixed(2)}</p>
                                </div>
                                
                                {order.status === 'shipped' && order.delivery && order.delivery.trackingNumber && (
                                    <div className="mt-3 sm:mt-0">
                                        <p className="font-medium">Tracking Number:</p>
                                        <p>{order.delivery.trackingNumber}</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Order Details (expandable) */}
                            {detailVisible[order.orderId] && (
                                <div className="p-4">
                                    {/* Status Timeline */}
                                    {order.statusHistory && order.statusHistory.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="font-medium mb-3">Order Status History</h3>
                                            <div className="relative pl-8 border-l-2 border-blue-900 ml-2">
                                                {order.statusHistory.map((statusEvent, index) => (
                                                    <div key={index} className="mb-4 relative">
                                                        <div className="absolute -left-10 w-4 h-4 rounded-full bg-blue-900"></div>
                                                        <p className="font-medium">{statusEvent.status.toUpperCase()}</p>
                                                        <p className="text-sm text-gray-500">{formatDate(statusEvent.timestamp)}</p>
                                                        {statusEvent.comment && (
                                                            <p className="text-sm mt-1">{statusEvent.comment}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                
                                    {/* Shipping, Billing and Payment Details */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Shipping Address */}
                                        <div className="border rounded-lg p-4">
                                            <h3 className="font-medium mb-2">Shipping Address</h3>
                                            <p>{order.customer.firstName} {order.customer.lastName}</p>
                                            <p>{order.customer.address.line1}</p>
                                            {order.customer.address.line2 && <p>{order.customer.address.line2}</p>}
                                            <p>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.postalCode}</p>
                                            <p>{order.customer.address.country}</p>
                                            <p className="mt-2">Phone: {order.customer.phone}</p>
                                            
                                            {order.delivery && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <h4 className="font-medium mb-1">Delivery Details</h4>
                                                    {order.delivery.method && <p>Method: {order.delivery.method}</p>}
                                                    {order.delivery.carrier && <p>Carrier: {order.delivery.carrier}</p>}
                                                    {order.delivery.trackingNumber && <p>Tracking: {order.delivery.trackingNumber}</p>}
                                                    {order.delivery.estimatedDelivery && (
                                                        <p>Estimated Delivery: {formatDate(order.delivery.estimatedDelivery)}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Billing Address */}
                                        <div className="border rounded-lg p-4">
                                            <h3 className="font-medium mb-2">Billing Address</h3>
                                            {order.customer.billingAddress ? (
                                                <>
                                                    {order.customer.billingAddress.sameAsShipping ? (
                                                        <>
                                                            <p className="text-sm text-gray-500 mb-2">Same as shipping address</p>
                                                            <p>{order.customer.firstName} {order.customer.lastName}</p>
                                                            <p>{order.customer.address.line1}</p>
                                                            {order.customer.address.line2 && <p>{order.customer.address.line2}</p>}
                                                            <p>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.postalCode}</p>
                                                            <p>{order.customer.address.country}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>{order.customer.firstName} {order.customer.lastName}</p>
                                                            <p>{order.customer.billingAddress.line1}</p>
                                                            {order.customer.billingAddress.line2 && <p>{order.customer.billingAddress.line2}</p>}
                                                            <p>{order.customer.billingAddress.city}, {order.customer.billingAddress.state} {order.customer.billingAddress.postalCode}</p>
                                                            <p>{order.customer.billingAddress.country}</p>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-2">Same as shipping address</p>
                                                    <p>{order.customer.firstName} {order.customer.lastName}</p>
                                                    <p>{order.customer.address.line1}</p>
                                                    {order.customer.address.line2 && <p>{order.customer.address.line2}</p>}
                                                    <p>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.postalCode}</p>
                                                    <p>{order.customer.address.country}</p>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Payment Details */}
                                        <div className="border rounded-lg p-4">
                                            <h3 className="font-medium mb-2">Payment Details</h3>
                                            <p>Method: {order.payment.method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                                            {order.payment.cardLast4 && <p>Card: **** **** **** {order.payment.cardLast4}</p>}
                                            <p className="mt-2">Status: <span className={`px-2 py-0.5 rounded ${order.payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.payment.status}
                                            </span></p>
                                            {order.payment.transactionId && <p className="mt-2">Transaction ID: {order.payment.transactionId}</p>}
                                            
                                            {/* Delivery Timeline Info */}
                                            {order.delivery && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <h4 className="font-medium mb-1">Delivery Timeline</h4>
                                                    {order.delivery.shippedDate && (
                                                        <p>Shipped: {formatDate(order.delivery.shippedDate)}</p>
                                                    )}
                                                    {order.delivery.deliveredDate && (
                                                        <p>Delivered: {formatDate(order.delivery.deliveredDate)}</p>
                                                    )}
                                                    {order.delivery.signedBy && (
                                                        <p>Signed By: {order.delivery.signedBy}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Item List */}
                                    <div className="mt-6">
                                        <h3 className="font-medium mb-3">Order Items</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {order.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    {item.image && (
                                                                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                                            <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.productName} />
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.size || 'N/A'}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-4 text-right font-medium">Subtotal:</td>
                                                        <td className="px-6 py-4">${order.subtotal.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-4 text-right font-medium">Shipping:</td>
                                                        <td className="px-6 py-4">${order.deliveryCost.toFixed(2)}</td>
                                                    </tr>
                                                    <tr className="bg-gray-50">
                                                        <td colSpan="4" className="px-6 py-4 text-right font-medium">Total:</td>
                                                        <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    
                                    {order.notes && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-medium mb-2">Order Notes</h3>
                                            <p>{order.notes}</p>
                                        </div>
                                    )}
                                    
                                    {/* Delivery Notes (if any) */}
                                    {order.delivery && order.delivery.notes && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-medium mb-2">Delivery Notes</h3>
                                            <p>{order.delivery.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;