import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      alert("Please login first");
      return navigate("/login");
    }

    try {
      await API.post(
        "/cart/add", 
        { product_id: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Added to cart!");
    } catch (error) {
      setMessage("Failed to add to cart");
      console.error(error);
    }
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <p>{product.description}</p>

      <button onClick={handleAddToCart}>Add to Cart</button>
      <p>{message}</p>
    </div>
  );
};

export default ProductDetails;
