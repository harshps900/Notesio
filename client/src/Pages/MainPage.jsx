import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import NavBar from "../Components/NavBar";
import NoteCard from "../Components/NoteCard";
import Form from "../Components/ReusableComponents/Form";
import NoteField from "../Components/ReusableComponents/NoteField";
import { useAuth } from "../Context/AuthProvider";
import { io } from "socket.io-client";
import swal from "sweetalert";
import SideBar from "../Components/SideBar";

export default function MainPage() {
    const [notes, setNotes] = useState([]);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [shareModal, setShareModal] = useState({ open: false, note: null });
    const [shareEmail, setShareEmail] = useState("");
    const [sharePermission, setSharePermission] = useState("view");
    const [currentNote, setCurrentNote] = useState(null);
    const { showToast, user } = useAuth();
    const [searchterm, setSearchTerm] = useState("");
    const [filteredNotes, setFilteredNotes] = useState([]);

    // keep socket ref so it's stable across renders
    const socketRef = useRef(null);

    const toggleNote = () => {
        setIsNoteOpen((prev) => !prev);
        if (isNoteOpen) {
            setCurrentNote(null);
        }
    };

    // Safety: ensure note/user exist
    const getPermission = (note) => {
        if (!note || !user?._id) return null;
        if (note.userId?._id === user._id) return "edit"; // owner
        const shareInfo = note.sharedWith?.find(
            (s) => s.user?._id === user._id
        );
        return shareInfo?.permission || null;
    };


    // fetch notes
    const fetchNotes = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/api/notes", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setNotes(Array.isArray(data.note) ? data.note : []);
        } catch (error) {
            console.log("fetchNotes error:", error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // create
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
                // add locally (server should also emit via socket)
                setNotes(prev => [res.data.note, ...prev]);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to create note", "error");
        }
    };

    // update
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
                // optimistic local replace
                setNotes(prev => prev.map(n => n._id === res.data.note._id ? res.data.note : n));
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to update note", "error");
        }
    };

    // delete
    const onDelete = async (id) => {
        try {
            swal({
                title: 'Are you sure?',
                text: "This will delete the Note!",
                icon: 'warning',
                dangerMode: true,
                buttons: ["Cancel", "Yes"],
            }).then(async (willDelete) => {
                if (!willDelete) return; {
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
                        showToast("Note Deleted successfully", "info");
                        setNotes(prev => prev.filter(n => n._id !== id));
                    }
                }
            });
        } catch (error) {
            console.log(error);
            showToast("Failed to delete note", "error");
        }
    };

    // share
    const handleShareNote = async () => {
        swal({
            title: 'Are you sure?',
            text: "This ia will share your note !",
            icon: 'warning',
            dangerMode: true,
            buttons: ["Cancel", "Yes"],
        }).then(async (willShare) => {
            if (!willShare) return;
            if (!shareModal.note) return showToast("No note selected to share", "warning");
            const res = await axios.post(
                `http://localhost:4000/api/notes/share/${shareModal.note._id}`,
                { email: shareEmail, permission: sharePermission },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (res.data.success) {
                showToast("Note shared successfully", "success");
                setShareModal({ open: false, note: null });
                setShareEmail("");
                setSharePermission("view");
                if (res.data.note) {
                    setNotes(prev => prev.map(n => n._id === res.data.note._id ? res.data.note : n));
                } else fetchNotes();
            }
        }
        );
    };

    // socket creation — run once when user changes
    useEffect(() => {
        if (!user?._id) return;
        // create socket and store in ref
        const socket = io("http://localhost:4000", {
            auth: { token: localStorage.getItem("token") }, // use auth instead of query
        });
        socketRef.current = socket;
        const handleConnect = () => console.log("Connected to server via socket.io");
        const handleNoteCreated = (newNote) => {
            setNotes((prevNotes) => [newNote, ...prevNotes].filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i));
        };
        const handleNoteUpdated = (updatedNote) => {
            setNotes((prevNotes) => prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));
        };
        const handleNoteDeleted = (deletedNoteId) => {
            setNotes((prevNotes) => prevNotes.filter((note) => note._id !== deletedNoteId));
        };
        const handleNoteShared = (sharedNote) => {
            showToast(`A note has been shared with you: "${sharedNote.title}"`, "info");
            setNotes((prevNotes) => [sharedNote, ...prevNotes]);
        };
        socket.on("connect", handleConnect);
        socket.on("noteCreated", handleNoteCreated);
        socket.on("noteUpdated", handleNoteUpdated);
        socket.on("noteDeleted", handleNoteDeleted);
        socket.on("noteShared", handleNoteShared);
        socket.on("disconnect", () => console.log("Disconnected from server"));
        // cleanup on unmount / user change
        return () => {
            socket.off("connect", handleConnect);
            socket.off("noteCreated", handleNoteCreated);
            socket.off("noteUpdated", handleNoteUpdated);
            socket.off("noteDeleted", handleNoteDeleted);
            socket.off("noteShared", handleNoteShared);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user?._id, showToast]);

    // join rooms whenever `notes` array changes and socket is ready
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;
        notes.forEach(note => {
            if (note?._id) socket.emit("joinNoteRoom", note._id);
        });
    }, [notes]);

    // filtered notes
    useEffect(() => {
        const filtered = notes.filter((note) =>
            (note.title || "").toLowerCase().includes(searchterm.toLowerCase()) ||
            (note.description || "").toLowerCase().includes(searchterm.toLowerCase())
        );
        setFilteredNotes(filtered);
    }, [searchterm, notes]);

    // onEdit open and join a single room
    const onEdit = (note) => {
        setCurrentNote(note);
        setIsNoteOpen(true);
        const socket = socketRef.current;
        if (socket && note && note._id) {
            socket.emit("joinNoteRoom", note._id);
        }
    };

    return (
        <div className="w-full fixed h-screen flex flex-col bg-gray-100">
            <NavBar searchterm={searchterm} setSearchTerm={setSearchTerm} />
            <div className="flex  ">
                {/* sidebar */}
                <div className="">
                    <SideBar />
                </div>
                {/* Notes grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-2 mt-4  md:gap-6">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => {
                            const perm = getPermission(note);
                            return (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    permission={perm}
                                    onEdit={() => perm === 'edit' && onEdit(note)}
                                    onDelete={() => perm === 'edit' && onDelete(note._id)}
                                    onShare={(n) => setShareModal({ open: true, note: n })}
                                />
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            {/* <div className="rounded-full h-22 w-22 bg-indigo-200 ">
                            
                            </div> */}
                            <p className="text-gray-500">{searchterm ? "No notes match your search." : "No notes yet. Create one!"}</p>
                        </div>
                    )}
                </div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/20 backdrop:blur-2xl bg-opacity-40">
                    <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <p className="text-xl font-semibold">{currentNote ? "Edit Note" : "Create Note"}</p>
                            <button onClick={toggleNote} className="text-gray-600 hover:text-red-500 text-2xl">×</button>
                        </div>
                        <Form
                            fields={NoteField}
                            onSubmit={(v) => { currentNote ? handleUpdateNote(v) : handleCreateNote(v); }}
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
                        <h2 className="text-lg font-semibold mb-4">Share "{shareModal.note?.title ?? ''}"</h2>
                        <input
                            type="email"
                            placeholder="Enter user email"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md mb-4"
                        />
                        <div className="mb-4">
                            <p className="font-medium mb-2">Permission</p>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="permission"
                                        value="view"
                                        checked={sharePermission === "view"}
                                        onChange={() => setSharePermission("view")}
                                    /> View
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="permission"
                                        value="edit"
                                        checked={sharePermission === "edit"}
                                        onChange={() => setSharePermission("edit")}
                                    /> Edit
                                </label>
                            </div>
                        </div>
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
