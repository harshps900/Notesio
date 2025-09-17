import Notes from '../Model/NoteModel.js'

export const createNote = async (req, res) => {

    const { title, description } = req.body
    console.log('this is req.body', req.body)
    console.log('title', title)
    console.log('message', description)
    if (!title || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        const note = await Notes.create({ title, description, userId: req.user.id })
        console.log('this is note', note)
        return res.status(201).json({ success: true, message: "Note created successfully", note })
    } catch (error) {
        console.log(error)

        return res.status(500).json({ success: false, message: "Server error while creating note." });
    }
}
export const allNotes = async (req, res) => {
    try {
        const note = await Notes.find().populate('userId', 'name'); // Populate userId to get user's name
        return res.status(201).json({ success: true, note })
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

        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this note." });
        }

        const updatedNote = await Notes.findByIdAndUpdate(id, { title, description }, { new: true });
        return res.status(200).json({ success: true, message: "Note updated successfully", note: updatedNote });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error while editing note." });
    }
}
export const deleteNote = async (req, res) => {
    const { id } = req.params
    try {
        const deleteNote = await Notes.findByIdAndDelete(id)
        if (!deleteNote) {
            return res.status(404).json({ success: false, message: "Note not found." })
        }
        return res.status(200).json({ success: true, message: "Note deleted successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error while deleting note." })
    }
}