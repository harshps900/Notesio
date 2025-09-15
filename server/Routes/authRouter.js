import express from 'express'
import { registerUser, loginUser, logout } from '../Controller/userController.js';
const authRouter = express.Router()
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logout);
export default authRouter