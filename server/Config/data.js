import mongoose from "mongoose";

export default async function data() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notiodb';
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    } 
}