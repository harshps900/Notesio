import jwt from 'jsonwebtoken'
import User from '../Model/userModel.js';
export const middleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    try {
        if (!token || token === "undefined" || token === "null") {
            return res.status(401).json({ success: false, message: 'Unauthorized access: No valid token provided.' });
        }
        const secretKey = process.env.SECRET_KEY || "Secret#text";
        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized access: Invalid token.' });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with this token.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized access. Please login.' });
    }
};