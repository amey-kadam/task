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
  } catch (error) {
    alert("You must be logged in to add to cart.");
    navigate("/login");
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
