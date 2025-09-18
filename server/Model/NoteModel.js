import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sharedWith: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        permission: {
            type: String,
            enums: ['view', 'edit'],
            default: 'view'
        }
    }],
    isPublic: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

const Notes = mongoose.models.Notes || mongoose.model("Notes", NoteSchema);
export default Notes;
