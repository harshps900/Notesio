import express from 'express'
import { createNote, allNotes, editNote, SoftDeleteNote, shareNote, getTrashNotes, deletePermanently, restoreNote, toggleFavourite, deleteAllNotes, updateNotePriorities } from '../Controller/NoteController.js'
import { middleware as authMiddleware } from '../middleware/middleware.js'
import upload from '../Middleware/multer.js';
const noteRouter = express.Router()
noteRouter.post('/create', authMiddleware, upload.single('image'), createNote)
noteRouter.get('/', authMiddleware, allNotes)
noteRouter.put('/edit/:id', authMiddleware, upload.single('image'), editNote)
noteRouter.post('/priority', authMiddleware, updateNotePriorities)
noteRouter.post('/SoftDelete/:id', authMiddleware, SoftDeleteNote)
noteRouter.post('/favourite/:id', authMiddleware, toggleFavourite)
noteRouter.post('/restore/:id', authMiddleware, restoreNote)
noteRouter.post('/share/:id', authMiddleware, shareNote)
noteRouter.get('/trash', authMiddleware, getTrashNotes)
noteRouter.delete('/delete/:id', authMiddleware, deletePermanently)
noteRouter.delete('/deleteAll', authMiddleware, deleteAllNotes)
export default noteRouter