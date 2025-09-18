import { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify'
import axios from "axios";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const showToast = (message, type = "default") => {
        const toastType = type === 'warning' ? 'warn' : type;
        toast(message, { type: toastType });
    };

    const getErrorMessage = (error) => {
        return error.response?.data?.message || "An unexpected server error occurred";
    };

    const fetchAllUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.get("http://localhost:4000/api/auth/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllUsers(res.data.users);
        } catch (error) {
            console.error("Failed to fetch all users:", error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedLogin = localStorage.getItem("isLoggedIn");

        if (storedUser && storedLogin === "true") {
            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
                fetchAllUsers(); // Fetch all users if logged in
            } catch (error) {
                console.error("Failed to parse user data", error);
                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
            }
        }
        setLoading(false);
    }, []);

    const RegisterUser = async (data) => {
        try {
            const res = await axios.post(`http://localhost:4000/api/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.success) {
                setIsRegistered(true);
                setUser(res.data.user);
                
                setLoading(false);
                showToast('Registration Successful', 'success');
                return { success: true };
            } else {
                showToast(res.data.message || "Registration failed", "warning");
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            showToast(getErrorMessage(error), "error");
            return { success: false };
        }
    };
    // console.log('hiii',user)
    const LoginUser = async (data) => {
        try {
            const res = await axios.post(`http://localhost:4000/api/auth/login`, data, {
                withCredentials: true,
            });
            if (res.data.success) {

                setIsLoggedIn(true);
                setUser(res.data.user)
                localStorage.setItem("user", JSON.stringify(res.data.user)); 
                localStorage.setItem("token", res.data.user.token);
                localStorage.setItem("isLoggedIn", "true");
                await fetchAllUsers(); // Fetch all users on login
                console.log(res.data.user)
                showToast("Logged in successfully!", "success");
                return { success: true, user: res.data.user };
            } else {
                showToast(res.data.message || "Login failed", "warning");
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            showToast(getErrorMessage(error), "error");
            return { success: false };
        }
    };

const logout = async () => {
    try {
        const token = localStorage.getItem("token");

        await axios.post(
            "http://localhost:4000/api/auth/logout",
            {}, // no body needed
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true, // keep if you’re also using cookies
            }
        );  
        console.log(axios)
        setIsLoggedIn(false);
        setUser(null);
        setAllUsers([]);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        showToast("Logged out successfully", "info");
    } catch (err) {
        console.error("Logout failed:", err);
        showToast("Logout failed", "error");
    }
};


    const value = { isLoggedIn, isRegistered, user, allUsers, loading, showToast, RegisterUser, LoginUser, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
        </AuthContext.Provider>
    );
};
