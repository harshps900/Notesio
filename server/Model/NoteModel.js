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
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // users this note is shared with
        }
    ],
    isPublic: {
        type: Boolean,
        default: false, // for public share links
    },
    isPinned: {
        type: Boolean,
        default: false, // for sticky/pinned notes UI
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update `updatedAt` on edit
NoteSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Notes = mongoose.model("Notes", NoteSchema);
export default Notes;
