import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch cart items to display summary
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load cart for checkout");
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  const placeOrder = async (e) => {
    e.preventDefault(); // Prevent form submission
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await API.post(
        "/orders/place",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/my-orders"), 1500);
    } catch (err) {
      setMessage("Failed to place order");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

          {/* Left Column: Shipping & Payment Forms */}
          <div className="lg:col-span-7 space-y-8">

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Information</h2>
              <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1">
                    <input type="text" id="address" name="address" autoComplete="street-address" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border" placeholder="123 Main St" />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1">
                    <input type="text" id="city" name="city" autoComplete="address-level2" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border" placeholder="New York" />
                  </div>
                </div>

                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                  <div className="mt-1">
                    <input type="text" id="postal-code" name="postal-code" autoComplete="postal-code" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border" placeholder="10001" />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input id="card" name="payment-type" type="radio" defaultChecked className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700"> Credit Card </label>
                </div>
                <div className="flex items-center">
                  <input id="cod" name="payment-type" type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700"> Cash on Delivery </label>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="mt-10 lg:mt-0 lg:col-span-5 bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex text-sm">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">₹{Number(item.price) * item.quantity}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 flex items-center justify-between mt-4">
              <dt className="text-base font-medium text-gray-900">Order Total</dt>
              <dd className="text-xl font-bold text-indigo-600">₹{total.toFixed(2)}</dd>
            </div>

            <div className="mt-8">
              <button
                onClick={placeOrder}
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Confirm Order
              </button>
            </div>

            {message && (
              <div className={`mt-4 p-4 rounded-md text-center ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
