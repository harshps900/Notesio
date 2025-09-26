import Notes from '../Model/NoteModel.js'
import User from '../Model/UserModel.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Status from '../Model/StatusModel.js';


export const createNote = async (req, res) => {
    const { title, description, color, priority, status, } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!title) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        const note = await Notes.create({
            title,
            description,
            color: color || null, // Ensure color is saved, even if null
            status: status || 'onStart',
            imageUrl,
            // tags,
            userId: req.user.id
        });
        // Emit to all clients except the sender
        if (req.io && req.user.socketId) {
            req.io.except(req.user.socketId).emit("noteCreated", note);
        }
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
                // Notes owned by the user that are not deleted
                { userId: userId, isDeleted: { $ne: true } },
                { 'sharedWith.user': userId }
            ]
        })
            .populate('userId', 'name')
            .populate('sharedWith.user', 'name email')
            .populate('lastEditedBy', 'name')
            .sort({ updatedAt: -1 });
        return res.status(200).json({ success: true, note: notes, });
    } catch (error) {
        return res.status(500).json({ success: false, message: "No notes found." });
    }
}

export const editNote = async (req, res) => {
    const { id } = req.params;
    const { title, description, color, priority, status, } = req.body;
    const updateData = { lastEditedBy: req.user.id };

    // Only add fields to updateData if they are provided in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    // if (tags !== undefined) updateData.tags = tags;

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        const ownerId = note.userId._id ? note.userId._id.toString() : note.userId.toString();
        const isOwner = ownerId === req.user.id;
        const isSharedWith = note.sharedWith.some(
            share => share.user && share.user.toString() === req.user.id && share.permission === 'edit'
        );
        if (!isOwner && !isSharedWith) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this note." });
        }
        if (req.file) {

            if (note.imageUrl) {
                const oldImagePath = path.join(path.resolve(), note.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate("userId", "name")
            .populate("sharedWith.user", "name email")
            .populate('lastEditedBy', 'name');

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

export const updateNoteDetails = async (req, res) => {
    const { id } = req.params;
    const { color, priority, status, isFavourite } = req.body;
    const updateData = { lastEditedBy: req.user.id };

    // Only add fields to updateData if they are provided in the request
    if (color !== undefined) updateData.color = color;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (isFavourite !== undefined) updateData.isFavourite = isFavourite;

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        const ownerId = note.userId._id ? note.userId._id.toString() : note.userId.toString();
        const isOwner = ownerId === req.user.id;
        const shareInfo = note.sharedWith.find(
            share => share.user && share.user.toString() === req.user.id && (share.permission === 'edit' || share.permission === 'view')
        );


        const isFavouriteUpdateOnly = Object.keys(updateData).length === 2 && 'isFavourite' in updateData && 'lastEditedBy' in updateData;

        if (isFavouriteUpdateOnly) {
            if (!isOwner && !shareInfo) {
                return res.status(403).json({ success: false, message: "You are not authorized to modify this note." });
            }
        } else {
            // For any other update (color, status, etc.), require 'edit' permission.
            if (!isOwner && (!shareInfo || shareInfo.permission !== 'edit')) {
                return res.status(403).json({ success: false, message: "You do not have permission to edit this note." });
            }
        }

        if (!isOwner && !shareInfo) {
            return res.status(403).json({ success: false, message: "You are not authorized to modify this note." });
        }

        const updatedNote = await Notes.findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .populate("userId", "name")
            .populate("sharedWith.user", "name email")
            .populate('lastEditedBy', 'name');

        const noteToEmit = updatedNote.toObject();
        if (req.io) req.io.to(id).emit("noteUpdated", noteToEmit);

        return res.status(200).json({ success: true, message: "Note updated successfully", note: updatedNote });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error while updating note details." });
    }
};
// Delete Note
export const SoftDeleteNote = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        const ownerId = note.userId._id ? note.userId._id.toString() : note.userId.toString();
        const isOwner = ownerId === req.user.id;
        const isSharedWith = note.sharedWith.some(
            (share) => share.user && share.user.toString() === req.user.id && share.permission === "edit"
        );


        if (!isOwner && !isSharedWith) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this note." });
        }

        await Notes.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

        // only emit if req.io exists
        if (req.io) req.io.to(id).emit("noteDeleted", id);

        return res.status(200).json({ success: true, message: "Note moved to trash successfully" });
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
            return res.status(400).json({ success: true, message: "Note is already shared with this user." });
        }

        note.sharedWith.push({ user: userToShareWith._id, permission, });
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

// Get soft-deleted notes for the user
export const getTrashNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        const trashNotes = await Notes.find({
            isDeleted: true,
            $or: [
                { userId: userId }, // Notes owned by the user
                { 'sharedWith.user': userId } // Notes shared with the user
            ]
        }).populate('userId', 'name')
            .sort({ updatedAt: -1 });

        return res.status(200).json({ success: true, note: trashNotes });
    } catch (error) {
        console.error("Error fetching trash notes:", error);
        return res.status(500).json({ success: false, message: "Server error while fetching trash." });
    }
};
// permanent delete the note
export const deletePermanently = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found." });
        }

        const ownerId = note.userId._id ? note.userId._id.toString() : note.userId.toString();
        const isOwner = ownerId === req.user.id;
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

// Restore a soft-deleted note
export const restoreNote = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found in trash." });
        }

        const ownerId = note.userId._id ? note.userId._id.toString() : note.userId.toString();
        const isOwner = ownerId === req.user.id;
        const isSharedWith = note.sharedWith.some(
            (share) => share.user && share.user.toString() === req.user.id && share.permission === "edit"
        );


        if (!isOwner && !isSharedWith) {
            return res.status(403).json({ success: false, message: "You are not authorized to restore this note." });
        }

        await Notes.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        return res.status(200).json({ success: true, message: "Note restored successfully" });
    } catch (error) {
        console.error("Error restoring note:", error);
        return res.status(500).json({ success: false, message: "Server error while restoring note." });
    }
};

// delete all
export const deleteAllNotes = async (req, res) => {
    try {
        const userId = req.user.id;


        const result = await Notes.deleteMany({
            userId: userId,
            isDeleted: true
        });

        return res.status(200).json({ success: true, message: `All trash notes deleted successfully. Count: ${result.deletedCount}` });
    } catch (error) {
        console.error("Error deleting all notes:", error);
        return res.status(500).json({ success: false, message: "Server error while deleting all notes." });
    }
}



export const createStatus = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ success: false, message: "Status name is required." });
    }

    try {
        const newStatus = await Status.create({
            name,
            userId
        });
        res.status(201).json({ success: true, message: "Status created successfully", status: newStatus });
    } catch (error) {
        console.error("Error creating status:", error);
        res.status(500).json({ success: false, message: "Server error while creating status." });
    }
};
export const getStatuses = async (req, res) => {
    try {
        const userId = req.user.id;
        const defaultStatuses = [
            { _id: 'onStart', name: 'onStart', isDefault: true },
            { _id: 'progress', name: 'Progress', isDefault: true },
            { _id: 'done', name: 'Done', isDefault: true }
        ];
        const customStatuses = await Status.find({ userId });
        const allStatuses = [...defaultStatuses, ...customStatuses];
        res.status(200).json({ success: true, statuses: allStatuses });
    } catch (error) {
        console.error("Error fetching statuses:", error);
        res.status(500).json({ success: false, message: "Server error while fetching statuses." });
    }
};
export const deleteStatus = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }
    // Prevent deletion of default statuses
    if (['onStart', 'progress', 'done'].includes(id)) {
        return res.status(403).json({ success: false, message: "Cannot delete a default status." });
    }
    try {
        const status = await Status.findOne({ _id: id, userId });
        if (!status) {
            return res.status(404).json({ success: false, message: "Status not found." });
        }
        // Move notes from the deleted status to 'onStart'
        await Notes.updateMany(
            { userId: userId, status: id },
            { $set: { status: 'onStart' } }
        );
        await Status.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Status deleted successfully" });

    } catch (error) {
        console.error("Error deleting status:", error)
    }
}
