import { useState, useEffect } from 'react';
import CategoriesDropdown from './CategoriesDropdown';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Load user data and set up event listeners
    useEffect(() => {
        // Initial load of user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        
        // Function to handle storage changes
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
        };
        
        // Set up event listeners for both custom events and storage events
        window.addEventListener('storageUpdated', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);
        
        // Check for user data periodically (backup method)
        const intervalId = setInterval(() => {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
                setUser(currentUser);
            }
        }, 1000);
        
        // Clean up listeners and interval
        return () => {
            window.removeEventListener('storageUpdated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.categories-button') && !event.target.closest('.categories-dropdown')) {
                setCategoriesOpen(false);
            }
            if (!event.target.closest('.mobile-menu-button') && !event.target.closest('.mobile-menu')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
        
        // Dispatch storage updated event
        window.dispatchEvent(new Event('storageUpdated'));
    };

    return (
        <nav className="relative bg-blue-900 sticky top-0 z-20 w-full">
            <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-5 md:px-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCategoriesOpen(!categoriesOpen);
                    }}
                    className="categories-button flex h-full w-32 items-center justify-center bg-pink-500 hover:bg-pink-300 md:w-40"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-1 h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    Categories
                </button>
                
                <div className="hidden md:flex gap-8">
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/newArrivals">New Arrivals</Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/">Home</Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/about-us">About</Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/contact">Contact Us</Link>
                </div>
                
                <div className="hidden md:flex gap-4">
                    {user ? (
                        <button 
                            className="font-light text-white hover:text-pink-300 hover:underline" 
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    ) : (
                        <>
                            <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/login">Login</Link>
                            <span className="text-white">|</span>
                            <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
                
                <button 
                    className="mobile-menu-button md:hidden text-white" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setMobileMenuOpen(!mobileMenuOpen);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {categoriesOpen && <div className="categories-dropdown"><CategoriesDropdown /></div>}

            {mobileMenuOpen && (
                <div className="mobile-menu md:hidden absolute top-12 left-0 w-full bg-blue-900 shadow-lg p-4 flex flex-col items-center text-white">
                    <Link className="py-2 hover:text-pink-300" to="/newArrivals" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
                    <Link className="py-2 hover:text-pink-300" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link className="py-2 hover:text-pink-300" to="/about-us" onClick={() => setMobileMenuOpen(false)}>About</Link>
                    <Link className="py-2 hover:text-pink-300" to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
                    <hr className="my-2 w-full border-gray-500" />
                    {user ? (
                        <button 
                            className="py-2 hover:text-pink-300" 
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }}
                        >
                            Log Out
                        </button>
                    ) : (
                        <>
                            <Link className="py-2 hover:text-pink-300" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link className="py-2 hover:text-pink-300" to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;