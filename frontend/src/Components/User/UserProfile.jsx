// UserProfile.js - Fixed version

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MinePic from "../../assets/TeamLeader.jpg";

const UserProfileManagement = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        street: "",
        city: "",
        profileImage: ""
    });
    const [editField, setEditField] = useState(null);
    const [tempData, setTempData] = useState({ ...profile });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    // Fetch user data from backend when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            const userData = getUserAuth();
            if (!userData || !userData.id) {
                setError("You are not logged in. Please log in to view your profile.");
                setLoading(false);
                return;
            }
            
            try {
                // Use the endpoint from userRoutes.js
                const response = await axios.get(`http://localhost:5000/api/users/${userData.id}/profile`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}` // Include token if you're using JWT
                    }
                });
                
                // Transform the data if needed to match your component state
                const profileData = {
                    name: response.data.name || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                    address: response.data.address || "",
                    street: response.data.street || "",
                    city: response.data.city || "",
                    profileImage: response.data.profileImage || ""
                };
                
                setProfile(profileData);
                setTempData(profileData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile data:", error);
                setError("Failed to load profile. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchUserProfile();
    }, []);

    const handleEdit = (field) => setEditField(field);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const userData = getUserAuth();
        if (!userData || !userData.id) {
            setError("You are not logged in. Please log in to upload profile images.");
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            setLoading(true);
            const response = await axios.post(
                `http://localhost:5000/api/users/${userData.id}/upload-profile-image`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${userData.token}`
                    }
                }
            );
            
            setTempData(prev => ({
                ...prev,
                profileImage: response.data.profileImage
            }));
            setLoading(false);
        } catch (error) {
            console.error("Error uploading profile image:", error);
            setError("Failed to upload image. Please try again later.");
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        const userData = getUserAuth();
        if (!userData || !userData.id) {
            setError("You are not logged in. Please log in to update your profile.");
            return;
        }

        try {
            setLoading(true);
            
            if (editField === "profile") {
                const profileData = {
                    name: tempData.name,
                    email: tempData.email,
                    phone: tempData.phone,
                    profileImage: tempData.profileImage
                };
                
                await axios.put(
                    `http://localhost:5000/api/users/${userData.id}/profile`, 
                    profileData,
                    {
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        }
                    }
                );
            } else if (editField === "address") {
                const addressData = {
                    address: tempData.address,
                    street: tempData.street,
                    city: tempData.city
                };
                
                await axios.put(
                    `http://localhost:5000/api/users/${userData.id}/shipping-address`, 
                    addressData,
                    {
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        }
                    }
                );
            }
            
            setProfile({ ...tempData });
            setEditField(null);
            setLoading(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again later.");
            setLoading(false);
            alert("Error updating profile!");
        }
    };


    if (loading && !profile.name) {
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    if (error && !profile.name) {
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
        <div className="min-h-screen flex flex-col md:flex-row relative">
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
                        src={profile.profileImage || MinePic} 
                        alt="User Avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-semibold">Hello, {profile.name}</h2>
                    </div>
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li><Link to="/account" className="block py-2 px-4 rounded hover:bg-gray-200">Manage Account</Link></li>
                        <li><Link to="/order-history" className="block py-2 px-4 rounded hover:bg-gray-200">My Order History</Link></li>
                        <li><Link to="/payment-methods" className="block py-2 px-4 rounded hover:bg-gray-200">Payment Methods</Link></li>
                        
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 transition-all duration-300">
                <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">Account Details</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white p-4 rounded-lg shadow-lg border hover:border-blue-900 mb-4 text-center">
                    <h2 className="text-lg font-semibold mb-4">Profile</h2>
                    {editField === "profile" ? (
                        <div>
                            <input type="text" name="name" value={tempData.name} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                            <input type="email" name="email" value={tempData.email} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                            <input type="text" name="phone" value={tempData.phone} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                            <label className="block mb-2 font-semibold">Upload Profile Picture:</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full mb-4 p-2 border rounded" />
                            <div className="flex justify-center space-x-2">
                                <button 
                                    className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" 
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                                <button 
                                    className="mt-2 py-1 px-4 bg-gray-500 text-white rounded hover:bg-gray-600" 
                                    onClick={() => setEditField(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <img 
                                src={profile.profileImage || MinePic} 
                                alt="Profile Avatar" 
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" 
                            />
                            <p className="mb-2">Name: {profile.name}</p>
                            <p className="mb-2">Email: {profile.email}</p>
                            <p className="mb-2">Phone: {profile.phone || "Not provided"}</p>
                            <button 
                                className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" 
                                onClick={() => handleEdit("profile")}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Address Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Shipping Address */}
                    <div className="bg-white p-4 rounded-lg shadow border hover:border-blue-800">
                        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                        {editField === "address" ? (
                            <div>
                                <input type="text" name="address" value={tempData.address} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="street" value={tempData.street} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <input type="text" name="city" value={tempData.city} onChange={handleInputChange} className="block w-full mb-2 p-2 border rounded" />
                                <div className="flex justify-center space-x-2">
                                    <button 
                                        className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" 
                                        onClick={handleUpdate}
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update"}
                                    </button>
                                    <button 
                                        className="mt-2 py-1 px-4 bg-gray-500 text-white rounded hover:bg-gray-600" 
                                        onClick={() => setEditField(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">Address: {profile.address || "Not provided"}</p>
                                <p className="mb-2">Street: {profile.street || "Not provided"}</p>
                                <p className="mb-2">City: {profile.city || "Not provided"}</p>
                                <button 
                                    className="mt-2 py-1 px-4 bg-blue-900 text-white rounded hover:bg-blue-800" 
                                    onClick={() => handleEdit("address")}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfileManagement;