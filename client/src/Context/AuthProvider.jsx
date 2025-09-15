import { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify'
import axios from "axios";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export default function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    const showToast = (message, type = "default") => {
        const toastType = type === 'warning' ? 'warn' : type;
        toast(message, { type: toastType });
    };

    const RegisterUser = async (data) => {
        try {
            const res = await axios.post('http://localhost:4000/api/auth/register', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.success) {
                setIsRegistered(true);
                setLoading(false);
                showToast('Registration Successful', 'success');
                return { success: true };
            } else {
                showToast(res.data.message || "Registration failed", "warning");
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Server error during registration";
            showToast(errorMessage, "error");
            return { success: false };
        }
    };

    const LoginUser = async (data) => {
        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", data, {
                withCredentials: true,
            });
            if (res.data.success) {
                setIsLoggedIn(true);
                setUser(res.data.user);
                showToast("Logged in successfully!", "success");
                return { success: true, user: res.data.user };
            } else {
                showToast(res.data.message || "Login failed", "error");
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Server error during login";
            showToast(errorMessage, "error");
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:4000/api/auth/logout", {}, {
                withCredentials: true,
            });
            setIsLoggedIn(false);
            setUser(null);
            showToast("Logged out successfully", "info");
        } catch (err) {
            console.error(err);
            showToast("Logout failed", "error");
        }
    };

    const value = { isLoggedIn, isRegistered, user, showToast, RegisterUser, LoginUser, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
        </AuthContext.Provider>
    );
};
