import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotEnv from "dotenv";
import { Server } from "socket.io";
dotEnv.config();
import data from './Config/data.js';
import authRouter from "./Routes/authRouter.js";
import noteRouter from './Routes/noteRouter.js'
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
data()
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

// Middleware to attach io to each request
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/notes', noteRouter);

app.get('/', (req, res) => {
    res.json({ mesaage: "Api Working well" })
})

io.on("connection", (socket) => {
    // console.log("Client connected with socket.io:", socket.id);
    socket.emit("message", "Welcome! You are connected to the WebSocket server.");

    // Join a room based on user ID for personal notifications
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(userId);
    }
    socket.on('joinNoteRoom', (noteId) => {
        socket.join(noteId);
        console.log(`Socket ${socket.id} joined room ${noteId}`);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
    socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });
});

const handleServerError = (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use. Please close the other process or choose a different port.`);
        process.exit(1);
    } else {
        console.error('An unexpected server error occurred:', error);
        process.exit(1);
    }
};
io.on('error', handleServerError);
server.on('error', handleServerError);
server.listen(PORT, () => {
    console.log(`HTTP and WebSocket server running on http://localhost:${PORT}`);
});
