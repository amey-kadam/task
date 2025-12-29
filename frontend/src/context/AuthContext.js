import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // ideally we would verify the token with the backend here
            // for now we'll just assume presence of token = logged in
            // and maybe decode it if it's a JWT to get user info, but we don't have a decoder handy
            // so we'll just set a dummy user or true state
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setUser({ token, ...userData });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
