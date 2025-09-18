import Notes from '../Model/NoteModel.js'
import User from '../Model/UserModel.js';
import mongoose from "mongoose";

export const createNote = async (req, res) => {

    const { title, description } = req.body
    if (!title || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        const note = await Notes.create({ title, description, userId: req.user.id })
        req.io.emit("newNote", note)
        return res.status(201).json({ success: true, message: "Note created successfully", note })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server error while creating note." });
    }
}
export const allNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await Notes.find({
            $or: [
                { userId: userId },
                { 'sharedWith.user': userId }
            ]
        })
            .populate('userId', 'name')
            .populate('sharedWith.user', 'name email')
            .sort({ updatedAt: -1 });

        return res.status(200).json({ success: true, note: notes, });
    } catch (error) {
        return res.status(500).json({ success: false, message: "No notes found." });

    }
}

export const editNote = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const note = await Notes.findById(id);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        const isOwner = note.userId.toString() === req.user.id;
        const isSharedWith = note.sharedWith.some(
            share => share.user && share.user.toString() === req.user.id && share.permission === 'edit'
        );

        if (!isOwner && !isSharedWith) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this note." });
        }

        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        ).populate("userId", "name")
            .populate("sharedWith.user", "name email");

        
        const noteToEmit = updatedNote.toObject();

        
        if (req.io) req.io.to(id).emit("noteUpdated", noteToEmit);

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: updatedNote
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error while editing note." });
    }
};

// Delete Note
export const deleteNote = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        const isOwner = note.userId.toString() === req.user.id;
        const isSharedWith = note.sharedWith.some(
            (share) => share.user && share.user.toString() === req.user.id && share.permission === "edit"
        );


        if (!isOwner && !isSharedWith) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this note." });
        }

        await Notes.findByIdAndDelete(id);

        // only emit if req.io exists
        if (req.io) req.io.to(id).emit("noteDeleted", id);

        return res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({ success: false, message: "Server error while deleting note." });
    }
};

// Share Note
export const shareNote = async (req, res) => {
    const { id } = req.params;
    const { email, permission } = req.body;
    const sharerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    if (!email || !permission) {
        return res.status(400).json({ success: false, message: "Email and permission are required." });
    }

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        if (note.userId.toString() !== sharerId) {
            return res.status(403).json({ success: false, message: "You are not authorized to share this note." });
        }

        const userToShareWith = await User.findOne({ email });
        if (!userToShareWith) {
            return res.status(404).json({ success: false, message: `User with email "${email}" not found.` });
        }

        if (userToShareWith._id.toString() === sharerId) {
            return res.status(400).json({ success: false, message: "You cannot share a note with yourself." });
        }

        const alreadyShared = note.sharedWith.some(
            (share) => share.user && String(share.user) === String(userToShareWith._id)
        );

        if (alreadyShared) {
            return res.status(400).json({ success: false, message: "Note is already shared with this user." });
        }

        note.sharedWith.push({ user: userToShareWith._id, permission });
        await note.save();

        const populatedNote = await Notes.findById(note._id)
            .populate("userId", "name")
            .populate("sharedWith.user", "name email");

        if (req.io) req.io.to(userToShareWith._id.toString()).emit("noteShared", populatedNote.toObject());

        return res.status(200).json({
            success: true,
            message: `Note shared with ${email} successfully.`,
            note: populatedNote
        });

    } catch (error) {
        console.error("Error sharing note:", error);
        return res.status(500).json({ success: false, message: "Server error while sharing note." });
    }
};
