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
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    isDeleted: 
    {   type: Boolean, 
        default: false 
    }, 
    isFavourite: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        
    },
    priority: {
        type: Number,
        default: 0 // 0: None, 1: Low, 2: Medium, 3: High
    },
    imageUrl: {
        type: String, // URL or path to the image
        default: ''
    }
}, { timestamps: true });

const Notes = mongoose.models.Notes || mongoose.model("Notes", NoteSchema);
export default Notes;
