import mongoose from "mongoose";

export default async function data() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://harshpal:harshpal@cluster0.uthzg0z.mongodb.net/notesio?retryWrites=true&w=majority';
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB Atlas successfully!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    } 
}