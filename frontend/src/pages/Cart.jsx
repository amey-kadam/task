import { useEffect, useState } from "react";
import API from "../services/api";

const Cart = () => {
  const [items, setItems] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (error) {
      console.error("Failed to load cart");
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {items.length === 0 && <p>No items in cart</p>}

      {items.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
          <h3>{item.name}</h3>
          <p>₹{item.price} x {item.quantity}</p>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      {items.length > 0 && (
        <button
          onClick={() => window.location.href = "/checkout"}
          style={{ marginTop: "20px" }}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default Cart;
