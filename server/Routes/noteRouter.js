import express from 'express'
import { createNote, allNotes, editNote, deleteNote, shareNote } from '../Controller/NoteController.js'
import { middleware } from '../middleware/middleware.js'
const noteRouter = express.Router()
noteRouter.post('/create', middleware, createNote)
noteRouter.get('/' , middleware, allNotes)
noteRouter.put('/edit/:id', middleware, editNote)
noteRouter.delete('/delete/:id', middleware, deleteNote)
noteRouter.post('/share/:id', middleware, shareNote)
export default noteRouter