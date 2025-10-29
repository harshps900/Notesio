import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotEnv from "dotenv";
import { Server } from "socket.io";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
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

// Ensure the uploads directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRouter);

// Middleware to attach io to each request
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/notes', noteRouter);

app.get('/', (req, res) => {
    res.json({ message: "Api Working well" }) 
})

io.on("connection", (socket) => {
    console.log("Client connected with socket.io:", socket.id);
    socket.emit("message", "Welcome! You are connected to the WebSocket server.");

    // Attach socket.id to the user object for exclusion in broadcasts
    const userId = socket.handshake.auth.userId;
    if (userId) { // This now correctly uses the auth object
        socket.join(userId);
        socket.user = { id: userId, socketId: socket.id }; // Attach user info to the socket
    }

    socket.on('joinUserRoom', (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

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
