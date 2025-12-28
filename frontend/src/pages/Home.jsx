import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left animate-fade-in-up">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Discover the Future of</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Shopping Online</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience premium products with a seamless shopping journey. Curated just for you.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-transform transform hover:scale-105"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-50 flex items-center justify-center">
          {/* Placeholder for Hero Image - using a gradient/pattern for now if no image available */}
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-300">
            <span className="text-9xl opacity-20 font-bold">SHOP</span>
          </div>
        </div>
      </header>

      {/* Featured Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Handpicked selection of our finest items.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">Loading products...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
              {products.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
                  style={{ animationDelay: `${index * 100}ms` }} // Staggered animation
                >
                  <div className="w-full h-48 bg-gray-200 group-hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center">
                    {/* Placeholder for Product Image */}
                    <span className="text-gray-400 text-4xl">📦</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xl font-semibold text-indigo-500">₹{item.price}</p>
                      {/* Description truncated if needed, currently showing full */}
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

            <div className="mt-12 text-center">
              <Link to="/products">
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                  View All Products →
                </button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Footer / CTA */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block">Start shopping today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of satisfied customers who trust us for quality.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Sign Up Now
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
