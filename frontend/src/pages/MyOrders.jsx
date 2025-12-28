import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    API.get("/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map(order => (
        <div key={order.id} style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Total:</b> ₹{order.total_price}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
