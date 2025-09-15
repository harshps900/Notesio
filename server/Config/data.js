import mongoose from "mongoose";
export default async function data() {
    try {
        await mongoose.connect('mongodb://localhost:27017/notiodb')
            .then(() => { console.log("connected to mongodb sucessfully") })
    } catch (error) {
        console.log("Not Connected", error)
    } 
}