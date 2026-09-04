import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../Context/AuthProvider";
import { io } from "socket.io-client";
import { useTheme } from "../Context/ThemeProvider";
import { DndContext, } from "@dnd-kit/core";
import axios from "axios";
import NavBar from "../Components/NavBar";
import Form from "../Components/ReusableComponents/Form";
import NoteField from "../Components/ReusableComponents/NoteField";
import swal from "sweetalert";
import SideBar from "../Components/SideBar";
import Trash from "../Components/Trash";
import FavNote from '../Components/FavNotes'
import noteTa from '../assets/noteTa.png'
import DisplayNotes from "../Components/DisplayNotes";
import NoteColumn from '../Components/NoteColumn'
import NoteStatus from "../Components/ReusableComponents/StatusField";
import Editor from "../Components/Editor";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, FolderPlus, Sparkles, X, Share2, Star, Trash2 } from "lucide-react";


export default function MainPage() {
    // note states 
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [noteDetail, setNoteDetail] = useState(null); // State for the detail view modal
    // share state
    const [shareModal, setShareModal] = useState({ open: false, note: null });
    const [shareEmail, setShareEmail] = useState("");
    const [sharePermission, setSharePermission] = useState("view");
    // open and close states
    // const [value, setValue] = useState("1")
    const [isHomeCLick, setIsHomeClick] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isFavouritesClick, setIsFavouritesClick] = useState(false);
    const [isTrashClick, setIsTrashClick] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // other states
    const { isDark } = useTheme();
    const { showToast, user } = useAuth();
    const [searchterm, setSearchTerm] = useState("");
    // state change
    const [noteColumns, setNoteColumns] = useState([])
    const [isColOpen, setIsColOpen] = useState(false)
    // create note
    const [plainNote, setPlainNote] = useState('<p>Start typing...</p>');
    const [editingPlainNote, setEditingPlainNote] = useState(null); // State to hold the plain note being edited
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    // keep socket ref so it's stable across renders
    const socketRef = useRef(null);

    const favouriteNotes = useMemo(
        () => filteredNotes.filter(note => note.isFavourite),
        [filteredNotes]
    );

    const toggleNote = () => {
        setIsNoteOpen((prev) => !prev);
        if (isNoteOpen) {
            setCurrentNote(null);
        }
    };

    const toggleHome = () => {
        setIsHomeClick(true);
        setIsFavouritesClick(false);
        setIsTrashClick(false);
    }

    const toggleFavourites = () => {
        setIsFavouritesClick(true);
        setIsHomeClick(false);
        setIsTrashClick(false);
    }

    const toggleTrash = () => {
        setIsTrashClick(true);
        setIsFavouritesClick(false);
        setIsHomeClick(false);
    }

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    }
    const toggleCreate = () => {
        setIsCreateOpen(prev => !prev)
    }

    const toggleCol = () => {
        setIsColOpen(prev => !prev)
    }

    useEffect(() => {
        setIsHomeClick(true);
    }, [])

    // Safety: ensure note/user exist
    const getPermission = (note) => {
        if (!note || !user?._id) return null;
        if (note.userId?._id === user._id) return "edit";
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

    // fetch columns
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const { data } = await axios.get("http://localhost:4000/api/notes/statuses", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (data.success) {
                    setNoteColumns(data.statuses.map(s => ({ id: s._id, title: s.name })));
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        };
        fetchStatuses();
    }, []);
    // create
    const handleCreateNote = async (formData) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);

        if (formData.color) data.append("color", formData.color);
        if (formData.image && formData.image[0]) {
            data.append("image", formData.image[0]);
        }
        try {
            const res = await axios.post(
                "http://localhost:4000/api/notes/create",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                showToast("Note created successfully", "success");
                setIsNoteOpen(false);
                setNotes(prev => [res.data.note, ...prev]);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to create note", "error");
        }
    };
    const handlePlainNoteCreate = async () => {
        if (!plainNote || !plainNote.trim()) {
            return showToast("Note cannot be empty.", "warning");
        }
        try {
            const res = await axios.post(
                "http://localhost:4000/api/notes/plain",
                { content: plainNote },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                showToast("Note created successfully", "success");
                setNotes(prev => [res.data.note, ...prev]);
                setPlainNote(''); // Clear the editor after creation
                setEditingPlainNote(null);
                setIsCreateOpen(false); // Close the modal
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to create note", "error");
        }
    }

    const handleUpdatePlainNote = async () => {
        if (!editingPlainNote || !plainNote || !plainNote.trim()) {
            return showToast("Note content cannot be empty.", "warning");
        }

        try {
            const res = await axios.put(
                `http://localhost:4000/api/notes/edit/${editingPlainNote._id}`,
                { content: plainNote },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                showToast("Note updated successfully", "success");
                setNotes(prev => prev.map(n => n._id === res.data.note._id ? res.data.note : n));
                toggleCreate();
                setEditingPlainNote(null);
                setPlainNote('');
            }
        } catch (error) {
            console.error("Failed to update plain note:", error);
            showToast("Failed to update note.", "error");
        }
    };

    // Generic update function
    const updateNote = async (noteId, updateData) => {
        setNotes(prev => prev.map(n => n._id === noteId ? { ...n, ...updateData } : n));
        try {
            console.log(`Updating note ${noteId} with data:`, updateData);
            const res = await axios.patch(
                `http://localhost:4000/api/notes/update-details/${noteId}`,
                updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {

                setNotes(prev => prev.map(n => n._id === res.data.note._id ? res.data.note : n));

            } else {
                throw new Error(res.data.message || "Update failed");
            }
        } catch (error) {
            console.error("Failed to update note:", error);
            showToast("Failed to update note.", "error");
            fetchNotes(); // Revert to server state on failure
        }
    };

    // update
    const handleUpdateNote = async (formData, noteId) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description || ''); // Ensure description is not undefined
        if (formData.color) data.append("color", formData.color);
        if (formData.image && formData.image[0]) {
            data.append("image", formData.image[0]);
        }
        try {
            const res = await axios.put(
                `http://localhost:4000/api/notes/edit/${noteId}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
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

    // update note status
    const handleNoteStatusChange = async (noteId, newStatus) => {
        // Optimistic UI update
        setNotes(prev => prev.map(n => n._id === noteId ? { ...n, status: newStatus } : n));
        try {
            await axios.patch(
                `http://localhost:4000/api/notes/update-details/${noteId}`,
                { status: newStatus },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            // Find the column title to display in the toast message
            const column = noteColumns.find(c => c.id === newStatus);
            const columnTitle = column ? column.title : newStatus;
            showToast(`Note moved to ${columnTitle}`, "success");
        } catch (error) {
            console.error("Failed to update note status:", error);
            showToast("Failed to update note status.", "error");
            fetchNotes();
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
                    const res = await axios.post(
                        `http://localhost:4000/api/notes/SoftDelete/${id}`,
                        {},
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (res.data.success) {
                        console.log(res.data);
                        showToast("Note Deleted successfully and Moved to Trash", "info");
                        setNotes(prev => prev.filter(n => n._id !== id));
                    }
                }
            });
        } catch (error) {
            console.log(error);
            showToast("Failed to delete note", "error");
        }
    };

    // toggle favourite
    const onToggleFavourite = async (id, isFavourite) => {
        // Now uses the generic updateNote function
        await updateNote(id, { isFavourite });
        showToast(isFavourite ? "Note added to favourites" : "Note removed from favourites", "success");
    };

    // handle color change
    const handleColorChange = async (noteId, newColor) => {

        await updateNote(noteId, { color: newColor });
    };

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
            auth: { token: localStorage.getItem("token") },
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
        const handleNoteStatusChange = (noteId, newStatus) => {
            setNoteColumns(prev => prev.map(c => c.id === newStatus ? { ...c, id: noteId } : c));
        }
        const handleNoteShared = (sharedNote) => {
            showToast(`A note has been shared with you: "${sharedNote.title}"`, "info");
            setNotes((prevNotes) => [sharedNote, ...prevNotes]);
        };

        socket.emit("joinUserRoom", user._id); // Join user-specific room

        socket.on("connect", handleConnect);
        socket.on("noteCreated", handleNoteCreated);
        socket.on("noteUpdated", handleNoteUpdated);
        socket.on("noteDeleted", handleNoteDeleted);
        socket.on("noteShared", handleNoteShared);
        socket.on("noteStatusChanged", handleNoteStatusChange);
        socket.on("disconnect", () => console.log("Disconnected from server"));
        // cleanup on unmount / user change
        return () => {
            socket.off("connect", handleConnect);
            socket.off("noteCreated", handleNoteCreated);
            socket.off("noteUpdated", handleNoteUpdated);
            socket.off("noteDeleted", handleNoteDeleted);
            socket.off("noteShared", handleNoteShared);
            socket.off("noteStatusChanged", handleNoteStatusChange);
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
            (note.description || "").toLowerCase().includes(searchterm.toLowerCase()) ||
            (note.content && note.content.some(c => c.toLowerCase().includes(searchterm.toLowerCase())))
        );
        setFilteredNotes(filtered);
    }, [searchterm, notes]);

    // onEdit open and join a single room
    const onEdit = (note) => {
        // Check if it's a plain note (has content but no title)
        if (note.content && note.content.length > 0) {
            setEditingPlainNote(note);
            setPlainNote(note.content[0] || '');
            setIsCreateOpen(true);
        } else {
            // It's a regular note with a title
            setCurrentNote(note);
            setIsNoteOpen(true);
        }
        const socket = socketRef.current;
        if (socket && note?._id) socket.emit("joinNoteRoom", note._id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over) return
        const draggedItem = active.id;
        const noteId = typeof draggedItem === 'object' && draggedItem?._id ? draggedItem._id : draggedItem;
        const newStatus = over.id;

        const note = notes.find(n => n._id === noteId);

        if (note && note.status !== newStatus) {
            handleNoteStatusChange(noteId, newStatus);
        }
    }

    const handleCreateColumn = async (formData) => {
        const { name } = formData;
        if (!name || !name.trim()) {
            return showToast("Column name cannot be empty.", "warning");
        }
        try {
            const res = await axios.post("http://localhost:4000/api/notes/statuses",
                { name: name },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            if (res.data.success) {
                showToast("Column added successfully", "success");
                setNoteColumns(prev => [...prev, { id: res.data.status._id, title: res.data.status.name }]);
                toggleCol();
            }
        } catch (error) {
            console.error("Failed to add column:", error);
            showToast("Failed to add column.", "error");
        }
    };

    const handleDeleteStatus = async (id) => {

        try {
            swal({
                title: 'Are you sure?',
                text: "This will delete the status!",
                icon: 'warning',
                dangerMode: true,
                buttons: ["Cancel", "Yes"],
            }).then(async (willDelete) => {
                if (!willDelete) return; {
                    const res = await axios.delete(`http://localhost:4000/api/notes/statuses/${id}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (res.data.success) {
                        console.log(res.data);
                        showToast("status deleted successfully", "info");
                        setNoteColumns(prev => prev.filter(n => n.id !== id));
                    }
                }
            });
        } catch (error) {
            console.log(error);
            showToast(error.response?.data?.message || "Failed to delete the status", "error");
        }
    };

    const handleRestore = (restoredNote) => {

        setNotes(prev => [restoredNote, ...prev]);
    };

    return (
        <div className={`w-full md:fixed h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <NavBar searchterm={searchterm} setSearchTerm={setSearchTerm} menu={toggleMenu} />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden md:block border-r border-slate-200/60 dark:border-slate-800/80">
                    <SideBar
                        toggleHome={toggleHome} isHomeCLick={isHomeCLick}
                        toggleFavourites={toggleFavourites} isFavouritesClick={isFavouritesClick}
                        toggleTrash={toggleTrash} isTrashClick={isTrashClick}
                    />
                </aside>

                {/* Main Content Workspace */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {isHomeCLick && (
                        <div className="max-w-7xl mx-auto min-h-full flex flex-col">
                            {/* Workspace Top Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                        Home Workspace
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Organize notes across status columns, drag and drop tasks, and collaborate live.
                                    </p>
                                </div>
                            </div>

                            {/* Kanban / Notes Grid */}
                            <div className="flex-1">
                                <DndContext onDragEnd={handleDragEnd}>
                                    {filteredNotes.length > 0 ? (
                                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
                                            {noteColumns.map((col) => (
                                                <NoteColumn
                                                    key={col.id}
                                                    col={col}
                                                    notes={filteredNotes.filter(note => (note.status || 'onStart') === col.id)}
                                                    getPermission={getPermission}
                                                    setNoteDetail={setNoteDetail}
                                                    onEdit={onEdit}
                                                    onDelete={onDelete}
                                                    onToggleFavourite={onToggleFavourite}
                                                    onShare={(e, n) => { e.stopPropagation(); setShareModal({ open: true, note: n }); }}
                                                    onColorChange={handleColorChange}
                                                    onDeleteStatus={handleDeleteStatus}
                                                />
                                            ))}

                                            {/* Dedicated Add New Column Board Card */}
                                            <button
                                                onClick={toggleCol}
                                                className="w-72 h-48 shrink-0 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100/40 dark:bg-slate-900/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 cursor-pointer group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-sm">Add New Status Column</span>
                                            </button>
                                        </div>
                                    ) : (
                                        !searchterm && (
                                            <div className="flex flex-col items-center justify-center min-h-[55vh] w-full py-12 px-4">
                                                <div className="relative group mb-6">
                                                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                                                    <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-4 border border-indigo-200/50 dark:border-slate-700 shadow-inner">
                                                        <img draggable={false} src={noteTa} alt="No Notes" className="w-24 h-24 object-contain filter drop-shadow-md" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">
                                                    Your Workspace is Empty
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-8">
                                                    Capture thoughts, set up status columns, and manage your notes smoothly.
                                                </p>
                                                <div className="flex flex-wrap items-center justify-center gap-4">
                                                    <button
                                                        onClick={toggleNote}
                                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                        <span>Create Note</span>
                                                    </button>
                                                    <button
                                                        onClick={toggleCreate}
                                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition-all duration-200 cursor-pointer"
                                                    >
                                                        <FileText className="w-5 h-5" />
                                                        <span>Quick Note</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </DndContext>
                            </div>
                        </div>
                    )}

                    {/* Favourites View */}
                    {isFavouritesClick && (
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                                    Favourite Notes
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Quick access to all notes you've bookmarked as important.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favouriteNotes.length > 0 ? (
                                    favouriteNotes.map((note) => {
                                        const perm = getPermission(note);
                                        return (
                                            <FavNote
                                                key={note._id}
                                                note={note}
                                                permission={perm}
                                                noteDetail={() => setNoteDetail(note)}
                                                onEdit={() => onEdit(note)}
                                                onDelete={() => onDelete(note._id)}
                                                onToggleFavourite={onToggleFavourite}
                                                onShare={() => setShareModal({ open: true, note: note })}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center min-h-[50vh] text-center">
                                        <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mb-4 text-amber-500">
                                            <Star className="w-10 h-10 fill-amber-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                                            No favourite notes yet
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                            Click the star icon on any note card to pin it to your favourites list.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Trash View */}
                    {isTrashClick && (
                        <div className="max-w-7xl mx-auto">
                            <Trash onNoteRestored={handleRestore} />
                        </div>
                    )}
                </main>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-8 right-8 z-40 flex items-center gap-3">
                <button
                    onClick={toggleCreate}
                    title="Create Quick Note"
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 dark:bg-slate-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    <FileText className="w-5 h-5" />
                    <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 px-3 py-1 text-xs font-semibold text-white bg-slate-900 rounded-md shadow-md whitespace-nowrap">
                        Quick Note
                    </span>
                </button>
                <button
                    onClick={toggleNote}
                    title="Create Rich Note"
                    className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="w-7 h-7" />
                    <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 px-3 py-1 text-xs font-semibold text-white bg-slate-900 rounded-md shadow-md whitespace-nowrap">
                        Create Note
                    </span>
                </button>
            </div>

            {/* Create Status Modal */}
            <AnimatePresence>
                {isColOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl shadow-2xl w-full max-w-lg p-6 border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
                                <h3 className="text-xl font-bold">Create Status Column</h3>
                                <button onClick={toggleCol} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <Form
                                fields={NoteStatus}
                                onSubmit={handleCreateColumn}
                                buttonClassName="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 px-4 rounded-xl font-semibold transition-all shadow-md mt-2"
                                buttonText="Create Status"
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Quick Plain Note Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl shadow-2xl w-full max-w-2xl p-6 border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
                                <h3 className="text-xl font-bold">
                                    {editingPlainNote ? 'Edit Quick Note' : 'Create Quick Note'}
                                </h3>
                                <button onClick={toggleCreate} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <Editor value={plainNote} onChange={setPlainNote} />
                            <button
                                onClick={editingPlainNote ? handleUpdatePlainNote : handlePlainNoteCreate}
                                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 px-4 rounded-xl font-semibold transition-all shadow-md cursor-pointer"
                            >
                                {editingPlainNote ? 'Update Note' : 'Save Note'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create / Edit Form Note Modal */}
            <AnimatePresence>
                {isNoteOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl shadow-2xl w-full max-w-lg p-6 border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
                                <h3 className="text-xl font-bold">{currentNote ? `Edit Note` : "Create New Note"}</h3>
                                <button onClick={toggleNote} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <Form
                                fields={NoteField}
                                onSubmit={(v) => { currentNote ? handleUpdateNote(v, currentNote._id) : handleCreateNote(v); }}
                                initialValue={currentNote}
                                buttonClassName="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 px-4 rounded-xl font-semibold transition-all shadow-md"
                                buttonText={currentNote ? "Update Note" : "Create Note"}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Note Detail Modal */}
            <AnimatePresence>
                {noteDetail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md" onClick={() => setNoteDetail(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DisplayNotes note={noteDetail} onClose={() => setNoteDetail(null)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Share Note Modal */}
            <AnimatePresence>
                {shareModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl shadow-2xl w-full max-w-md p-6 border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-indigo-500" />
                                    <span>Share Note</span>
                                </h3>
                                <button onClick={() => setShareModal({ open: false, note: null })} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Sharing "{shareModal.note?.title || (shareModal.note?.content?.[0] || 'Untitled Note')}"
                            </p>
                            <input
                                type="email"
                                placeholder="Enter recipient email address..."
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                            />
                            <div className="mb-6">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Permission Level
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${sharePermission === "view" ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                                        <input
                                            type="radio"
                                            name="permission"
                                            value="view"
                                            checked={sharePermission === "view"}
                                            onChange={() => setSharePermission("view")}
                                            className="hidden"
                                        />
                                        <span>View Only</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${sharePermission === "edit" ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                                        <input
                                            type="radio"
                                            name="permission"
                                            value="edit"
                                            checked={sharePermission === "edit"}
                                            onChange={() => setSharePermission("edit")}
                                            className="hidden"
                                        />
                                        <span>Can Edit</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShareModal({ open: false, note: null })}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleShareNote}
                                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md transition-all"
                                >
                                    Share Note
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Drawer Menu */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="fixed top-0 left-0 bottom-0 w-72 z-50 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300">
                        <SideBar
                            toggleHome={toggleHome} isHomeCLick={isHomeCLick}
                            toggleFavourites={toggleFavourites} isFavouritesClick={isFavouritesClick}
                            toggleTrash={toggleTrash} isTrashClick={isTrashClick}
                            menu={toggleMenu}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
