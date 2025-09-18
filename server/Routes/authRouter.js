import express from 'express'
import { middleware } from '../middleware/middleware.js';
import { registerUser, loginUser, logout, getAllUsers } from '../Controller/userController.js';
const authRouter = express.Router()
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', middleware, logout);
authRouter.get('/users', middleware, getAllUsers);

export default authRouter