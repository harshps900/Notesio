import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Components/NavBar";
import NoteCard from "../Components/NoteCard";
import Form from "../Components/ReusableComponents/Form";
import NoteField from "../Components/ReusableComponents/NoteField";
import { useAuth } from "../Context/AuthProvider";
import { io } from 'socket.io-client';



export default function MainPage() {
    const [notes, setNotes] = useState([]);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [shareModal, setShareModal] = useState({ open: false, note: null });
    const [shareEmail, setShareEmail] = useState("");
    const [currentNote, setCurrentNote] = useState(null)
    const { showToast } = useAuth();
    const [searchterm, setSearchTerm] = useState("");
    const [filteredNotes, setFilteredNotes] = useState([]);


    const toggleNote = () => {
        setIsNoteOpen((prev) => !prev);
        if (isNoteOpen) {
            setCurrentNote(null);
        }
    };
    const handleFormSubmit = (formData) => {
        if (currentNote) {
            handleUpdateNote(formData);
        } else {
            handleCreateNote(formData);
        }
    };
    const handleCreateNote = async (formData) => {
        try {
            const res = await axios.post(
                "http://localhost:4000/api/notes/create",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                showToast("Note created successfully", "success");
                setIsNoteOpen(false);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to create note", "error");
        }
    };
    
    const handleUpdateNote = async (formData) => {
        try {
            const res = await axios.put(
                `http://localhost:4000/api/notes/edit/${currentNote._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                showToast("Note updated successfully", "success");
                setIsNoteOpen(false);
                setCurrentNote(null);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to update note", "error");
        }
    };

    const handleShareNote = async () => {
        try {
            const res = await axios.post(
                `http://localhost:4000/api/notes/share/${shareModal.note._id}`,
                { email: shareEmail },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                showToast("Note shared successfully", "success");
                setShareModal({ open: false, note: null });
                setShareEmail("");
            }
        } catch (error) {
            console.log(error);
            showToast(error.response?.data?.message || "Failed to share note", "error");
        }
    };

    const fetchNotes = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/api/notes", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setNotes(data.note);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchNotes();
    }, []);

    const onEdit = (note) => {
        setCurrentNote(note);
        setIsNoteOpen(true);
    }
    const onDelete = async (id) => {
        try {
            const res = await axios.delete(
                `http://localhost:4000/api/notes/delete/${id}`,

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                showToast("Note Deleted successfully", "Info");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const filteredNotes = notes.filter((note) =>
            note.title.toLowerCase().includes(searchterm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchterm.toLowerCase())
        );
        setFilteredNotes(filteredNotes);

    }, [searchterm, notes])

    // socket connection from client side 
    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('connect', () => {
            console.log('Connected to server via socket.io');
        });

        socket.on('noteCreated', (newNote) => {
            setNotes((prevNotes) => [newNote, ...prevNotes]);
        });

        socket.on('noteUpdated', (updatedNote) => {
            setNotes((prevNotes) =>
                prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
            );
        });

        socket.on('noteDeleted', (deletedNoteId) => {
            setNotes((prevNotes) => prevNotes.filter((note) => note._id !== deletedNoteId));
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => socket.disconnect();
    }, [])
    return (
        <div className="w-full fixed h-screen flex flex-col bg-gray-100">
            <NavBar searchterm={searchterm} setSearchTerm={setSearchTerm} />

            {/* Notes grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                        <NoteCard key={note._id} note={note}
                            onEdit={() => onEdit(note)}
                            onDelete={() => onDelete(note._id)}
                            onShare={(n) => setShareModal({ open: true, note: n })} />
                    ))) : (
                    <>
                        <p className="text-gray-500">{searchterm ? "No notes match your search." : "No notes yet. Create one!"}</p>
                    </>
                )}
            </div>

            {/* Floating Add Button */}
            <button
                onClick={toggleNote}
                className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full h-14 w-14 flex items-center justify-center shadow-lg transition"
            >
                +
            </button>

            {/* Create Note Modal */}
            {isNoteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop:blur-2xl bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <p className="text-xl font-semibold">{currentNote ? "Edit Note" : "Create Note"}</p>
                            <button onClick={toggleNote} className="text-gray-600 hover:text-red-500 text-2xl">×</button>
                        </div>
                        <Form
                            fields={NoteField}
                            onSubmit={handleFormSubmit}
                            initialValue={currentNote}
                            buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                            buttonText={currentNote ? "Edit Note" : "Create Note"}
                        />
                    </div>
                </div>
            )}

            {/* Share Note Modal */}
            {shareModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Share "{shareModal.note.title}"</h2>
                        <input
                            type="email"
                            placeholder="Enter user email"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShareModal({ open: false, note: null })} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                            <button onClick={handleShareNote} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Share</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
