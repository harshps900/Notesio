import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register controller 
export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Password and confirm password does not match" })
    }
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedPassword })
        const secretKey = process.env.SECRET_KEY || "Secret#text";
        const token = jwt.sign(
            { id: newUser._id },
            secretKey,
            { expiresIn: '7d' }
        );
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: token,
        };
        return res.json({ success: true, message: "User registered successfully", user:userResponse });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Server error during registration." 
        });
    }
}
// login controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const secretKey = process.env.SECRET_KEY || "Secret#text";
        const token = jwt.sign({ id: user._id }, secretKey, {
            expiresIn: "7d",
        });
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        };

        return res.json({ success: true, message: "User logged in successfully", user: userResponse });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Server error during login." 
        });
    }
}

// logout 
export const logout = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // This case should ideally be caught by middleware if it were applied,
            // but it's good practice to have it here for a public-facing logout endpoint.
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
        }

        // In a stateless JWT setup, the server doesn't need to do anything for logout
        // besides acknowledging the request. The client is responsible for deleting the token.
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '_id name email'); 
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while fetching users." });
    }
};