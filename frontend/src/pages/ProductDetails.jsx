import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);



    useEffect(() => {
        if (id) {
            API.get(`/products/${id}`)
                .then(res => setProduct(res.data))
                .catch(() => console.error("Product not found"));
        }
    }, [id]);

    if (!id) return <h2>Please select a product to view details.</h2>;

    if (!product) return <h2>Loading...</h2>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>₹{product.price}</p>
            <p>{product.description}</p>

            <button>Add to Cart</button>
        </div>
    );
};

export default ProductDetails;
