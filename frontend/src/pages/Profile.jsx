import { useState, useEffect } from "react";
import API from "../services/api";
import MyOrders from "./MyOrders";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, loading: authLoading } = useAuth(); // We can use this, or fetch fresh data
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            // We use the new GET endpoint we just created
            const res = await API.get("/user/update", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile({ name: res.data.name, email: res.data.email });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await API.put("/user/update", { ...profile, password }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Profile updated successfully!");
            setPassword(""); // clear password field
        } catch (error) {
            setMessage(error.response?.data?.error || "Update failed");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Profile</h2>
                {message && (
                    <div className={`p-4 mb-4 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                {/* We can reuse the MyOrders component logic or just import it if it's exportable 
            Since MyOrders.jsx is a full page component with its own container, 
            it might be better to import it but we should check if it has internal padding that might conflict.
            Looking at MyOrders.jsx, it has <div style={{ padding: "20px" }}>.
            It's fine, we'll just wrap it or let it be.
         */}
                <MyOrders />
            </div>
        </div>
    );
};

export default Profile;
