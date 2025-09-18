import jwt from 'jsonwebtoken'
import User from '../Model/UserModel.js';
export const middleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized access: No token provided.' })
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized     access: Invalid token.' })
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with this token.' })
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized access. Please login.' })
    }

}