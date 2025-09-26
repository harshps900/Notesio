import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

const Status = mongoose.models.Status || mongoose.model("Status", StatusSchema);
export default Status;