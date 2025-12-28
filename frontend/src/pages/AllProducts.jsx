import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get("/products");
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        All Products
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Browse our complete collection.
                    </p>

                    {/* Search Filter */}
                    <div className="mt-8 max-w-xl mx-auto">
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">🔍</span>
                            </div>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <p className="text-center text-gray-500 text-xl">Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500 text-xl">No products found matching "{searchTerm}"</p>
                ) : (
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                        {filteredProducts.map((item, index) => (
                            <div
                                key={item.id}
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="w-full h-48 bg-gray-200 group-hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center">
                                    <span className="text-gray-400 text-4xl">📦</span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="mt-2 text-xl font-semibold text-indigo-500">₹{item.price}</p>
                                    </div>
                                    <div className="mt-6">
                                        <Link to={`/product/${item.id}`}>
                                            <button className="w-full bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-indigo-600 transition-colors duration-300">
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;
