import { Link } from 'react-router-dom';

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    return (
        <nav className="relative bg-blue-900">
            <div className="mx-auto hidden h-12 w-full max-w-[1200px] items-center md:flex">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="ml-5 flex h-full w-40 cursor-pointer items-center justify-center bg-pink-500 hover:bg-pink-300"
                >
                    <div className="flex justify-around">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mx-1 h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                        Categories
                    </div>
                </button>

                <div className="mx-7 flex gap-8">
                    <a
                        className="font-light text-white relative inline-block duration-300 hover:text-pink-500 hover:underline group"
                        href="#"
                    >
                        New Arrivals
                        <span
                            className="absolute inset-0 h-[120%] w-[110%] border border-white rounded-full animate-pulse"
                            style={{
                                top: '5%',
                                bottom: '5%',
                                left: '-5%',
                            }}
                        ></span>
                    </a>

                    <a className="font-light text-white duration-100 hover:text-pink-300 hover:underline" href="catalog.html">
                        Home
                    </a>
                    <a className="font-light text-white duration-100 hover:text-pink-300 hover:underline" href="about-us.html">
                        About Us
                    </a>
                    <a className="font-light text-white duration-100 hover:text-pink-300 hover:underline" href="contact-us.html">
                        Catalogue
                    </a>
                    <a className="font-light text-white duration-100 hover:text-pink-300 hover:underline" href="contact-us.html">
                        Contact Us
                    </a>
                </div>

                <div className="ml-auto flex gap-4 px-5">
                    <a className="font-light text-white duration-100 hover:text-pink-300 hover:underline">
                        <Link to="/login">Login</Link>
                    </a>

                    <span className="text-white">&#124;</span>

                    <a className="font-light text-white duration-100 hover:text-pink-300 hover:underline">
                        <Link to="/signup">Sign Up</Link>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
