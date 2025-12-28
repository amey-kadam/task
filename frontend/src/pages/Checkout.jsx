import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Checkout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await API.post(
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>
      <p>Confirm your order below 👇</p>
      <button onClick={placeOrder}>Place Order</button>
      <p>{message}</p>
    </div>
  );
};

export default Checkout;
