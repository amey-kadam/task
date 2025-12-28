import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products"); // backend endpoint
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>All Products</h2>

      {products.length === 0 && <p>No products found.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            <Link to={`/product/${item.id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
