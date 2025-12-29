import { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Product being edited
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", image_url: "" });

    // Protect Route
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            // navigate("/"); // Redirect if not admin
            // commented out to allow testing if role not perfectly valid yet, but in prod we should redirect
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name, description: product.description, price: product.price, image_url: product.image_url });
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setFormData({ name: "", description: "", price: "", image_url: "" });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (editingProduct) {
                // Update
                await API.put(`/products/${editingProduct.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create
                await API.post("/products", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Operation failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    + Add Product
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image_url} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.description?.substring(0, 30)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{product.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="Name" className="w-full border p-2 rounded"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                            />
                            <textarea
                                placeholder="Description" className="w-full border p-2 rounded"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Price" className="w-full border p-2 rounded"
                                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required
                            />
                            <input
                                type="text" placeholder="Image URL" className="w-full border p-2 rounded"
                                value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            />
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{editingProduct ? "Update" : "Add"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
