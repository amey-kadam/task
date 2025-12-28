import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (error) {
      console.error("Failed to load cart");
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      }
    }
  };

  const removeItem = async (item_id) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/cart/remove",
        { item_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // refresh cart after removal
    } catch (error) {
      console.error("Could not remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate total price
  const total = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't added any items to the cart yet.</p>
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            {/* Cart Items List */}
            <section className="lg:col-span-7">
              <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-2xl">
                        📦
                      </div>
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link to={`/product/${item.product_id}`} className="font-medium text-gray-700 hover:text-indigo-600">
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label className="sr-only">Quantity, {item.name}</label>
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500"
                            >
                              <span className="sr-only">Remove</span>
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order Summary */}
            <section className="mt-16 bg-white rounded-lg shadow-sm px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">₹{total.toFixed(2)}</dd>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.href = "/checkout"}
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  Proceed to Checkout
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
