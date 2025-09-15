import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotEnv from "dotenv";
dotEnv.config();
import { WebSocketServer, WebSocket } from 'ws';
import data from './Config/data.js';
import authRouter from "./Routes/authRouter.js";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
data()
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get('/api/auth/', authRouter)
app.use('/api/auth', authRouter)
app.get('/', (req, res) => {
    res.json({ mesaage: "Api Working well" })
})

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {

            try {
                const messageToSend = typeof data === 'object' && data !== null ? JSON.stringify(data) : String(data);
                client.send(messageToSend, (err) => {
                    if (err) {
                        console.error('Error sending message to client:', err);
                    }
                });
            } catch (error) {
                console.error('Failed to stringify message data:', error);
            }
        }
    });
};
wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.send("Welcome! You are connected to the WebSocket server.");
    // Listen for messages from clients
    ws.on("message", (message) => {
        try {
            // Assuming message is a Buffer, convert it to a string.
            const messageString = message.toString();
            console.log(`Received: ${messageString}`);
            // Broadcast the received message to all clients
            wss.broadcast(messageString);
        } catch (error) {
            console.error('Failed to process message:', error);
        }
    });
    ws.on("close", () => {
        console.log("Client disconnected");
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
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
wss.on('error', handleServerError);
server.on('error', handleServerError);
server.listen(PORT, () => {
    console.log(`HTTP and WebSocket server running on http://localhost:${PORT}`);
});
