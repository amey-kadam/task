import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => console.error("Product not found"));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart.");
      return navigate("/login");
    }

    try {
      await API.post(
        "/cart/add",
        { product_id: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Product added to cart!");
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      alert("You must be logged in to add to cart.");
      navigate("/login");
    }
  };


  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl text-gray-500">Loading details...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Products
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 bg-gray-200 flex items-center justify-center h-96 md:h-auto">
              <span className="text-gray-400 text-6xl">📦</span>
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">{product.name}</h1>
              <p className="text-2xl text-indigo-600 font-bold mb-6">₹{product.price}</p>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 border border-transparent rounded-lg shadow-sm py-4 px-4 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors transform hover:-translate-y-1"
                >
                  Add to Cart
                </button>
              </div>

              {message && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md animate-fade-in-up">
                  <p className="text-green-700 text-center font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
