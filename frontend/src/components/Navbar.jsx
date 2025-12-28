import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Brand Name */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition-colors">
                            TASK SHOP
                        </Link>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex space-x-4">
                        <Link to="/login">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link to="/cart">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
                                Cart
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
