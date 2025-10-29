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
import { motion } from "framer-motion";


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
        <div className={`w-full  md:fixed h-screen flex flex-col ${isDark ? ' bg-gray-800' : 'bg-white'}`}>
            <NavBar searchterm={searchterm} setSearchTerm={setSearchTerm} menu={toggleMenu} />
            <div className="flex flex-1  ">
                {/* sidebar */}
                <aside className="   hidden md:block">
                    <SideBar
                        toggleHome={toggleHome} isHomeCLick={isHomeCLick}
                        toggleFavourites={toggleFavourites} isFavouritesClick={isFavouritesClick}
                        toggleTrash={toggleTrash} isTrashClick={isTrashClick}
                    />
                </aside>
                <div className=" flex-1  overflow-y-auto ">
                    {isHomeCLick && (
                        <>
                            <div className=' p-6 md:p-4 h-screen'>
                                <div className="flex justify-between  items-center mb-6">
                                    <h1 className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold `}>Home</h1>
                                    <button onClick={() => { toggleCol() }} className={` rounded-2xl cursor-pointer p-2  font-serif ${isDark ? 'text-gray-100 hover:bg-gray-900 ' : 'text-gray-800 hover:bg-indigo-600 hover:text-gray-50'}`}>Create Status</button>
                                </div>
                                <div className='flex  gap-2 flex-wrap  '>
                                    <DndContext onDragEnd={handleDragEnd}>
                                        {filteredNotes.length > 0 ? (
                                            noteColumns.map((col) => (
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
                                            ))
                                        ) : (
                                            <>
                                                {isHomeCLick && !searchterm && (
                                                    <div className="flex flex-col items-center justify-center mt-30 ml-30 h-full w-full overflow-hidden">
                                                        <div className="rounded-full h-62 w-62 bg-indigo-100  ">
                                                            <img draggable={false} src={noteTa} className="w-62 h-62 " />
                                                        </div>
                                                        <div className="flex flex-col text-center justify-center items-center  mt-6 h-full w-full">
                                                            <p className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-serif mb-6`}>{searchterm ? "No notes match your search." : "No notes yet. Create one!"}</p>
                                                            <button onClick={toggleNote} className={`p-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors w-55 `}>Create Note</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </DndContext>
                                </div>

                                {isColOpen && (
                                    <div className={`fixed inset-0 z-50 flex items-center justify-center  bg-black/20 backdrop:blur-2xl bg-opacity-40`}>
                                        <div className={` rounded-2xl shadow-2xl w-full max-w-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <div className={`flex justify-between items-center border-b ${isDark ? ' border-gray-200 ' : 'border-gray-200'} pb-2 mb-4`}>
                                                <p className={`text-xl font-semibold  ${isDark ? 'text-gray-100' : 'text-gray-800'} } `}>Create Status</p>
                                                <button onClick={toggleCol} className={` hover:text-red-500 text-2xl ${isDark ? 'text-gray-100' : 'text-gray-400'}`}>×</button>
                                            </div>
                                            <Form
                                                fields={NoteStatus}
                                                onSubmit={handleCreateColumn}
                                                buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors "
                                                buttonText="Create Status"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {isFavouritesClick && (
                        <div className="p-6 w-full">
                            <h1 className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold mb-6`}>Favourite Notes</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                                    <div className="flex  flex-col  h-screen w-full">
                                        <div className="flex flex-col items-center ml-80 justify-center h-full w-full">
                                            <p className={`text-2xl font-serif ${isDark ? 'text-gray-100' : 'text-gray-700'} font-bold mb-6`}>No favourite notes yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {isTrashClick && (
                        <Trash onNoteRestored={handleRestore} />
                    )}
                </div>
            </div>
            {/* Floating Add Button */}
            <button
                onClick={toggleNote}
                className="fixed bottom-8 right-8 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full h-14 w-14 flex items-center justify-center shadow-lg transition"
            >
                <p className="text-center mb-2">+</p>
            </button>
            <button
                onClick={toggleCreate}
                className="fixed bottom-8 right-28 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full h-14 w-14 flex items-center justify-center shadow-lg transition"
            >
                <p className="text-center mb-2">+</p>
            </button>
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/20 backdrop:blur-2xl bg-opacity-40">
                    <div className={` rounded-2xl shadow-2xl w-full max-w-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`flex justify-between items-center border-b ${isDark ? ' border-gray-200 ' : 'border-gray-200'} pb-2 mb-4`}>
                            <p className={`text-xl font-semibold  ${isDark ? 'text-gray-100' : 'text-gray-800'} `}>
                                {editingPlainNote ? 'Edit Plain Note' : 'Create Plain Note'}
                            </p>
                            <button onClick={toggleCreate} className={` hover:text-red-500 text-2xl ${isDark ? 'text-gray-100' : 'text-gray-400'}`}>×</button>
                        </div>
                        <Editor value={plainNote} onChange={setPlainNote} />
                        <button onClick={editingPlainNote ? handleUpdatePlainNote : handlePlainNoteCreate} className={`w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors`}>{editingPlainNote ? 'Update Note' : 'Create Note'}</button>

                    </div>
                </div>
            )}
            {/* Create Note Modal */}
            {isNoteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/20 backdrop:blur-2xl bg-opacity-40">
                    <motion.div
                        animate={{ y: 10, opacity: 1 }}
                        initial={{ opacity: 0 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5
                        }}
                        exit={{ opacity: 0 }} className={` rounded-2xl shadow-2xl w-full max-w-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`flex justify-between items-center border-b ${isDark ? ' border-gray-200 ' : 'border-gray-200'} pb-2 mb-4`}>
                            <p className={`text-xl font-semibold  ${isDark ? 'text-gray-100' : 'text-gray-800'} } `}>{currentNote ? `Edit Note` : "Create Note"}</p>
                            <button onClick={toggleNote} className={` hover:text-red-500 text-2xl ${isDark ? 'text-gray-100' : 'text-gray-400'}`}>×</button>
                        </div>
                        <Form
                            fields={NoteField}
                            onSubmit={(v) => { currentNote ? handleUpdateNote(v, currentNote._id) : handleCreateNote(v); }}
                            initialValue={currentNote}
                            buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                            buttonText={currentNote ? "Edit Note" : "Create Note"}
                        />
                    </motion.div>
                </div>
            )}

            {/* Note Detail Modal */}
            {noteDetail && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ y: 10, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5
                    }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-50 flex  items-center justify-center  `} onClick={() => setNoteDetail(null)}>
                    <DisplayNotes note={noteDetail} onClose={() => setNoteDetail(null)} />
                </motion.div>
            )}

            {/* Share Note Modal */}
            {shareModal.open && (
                <div className={`fixed flex items-center justify-center inset-0 z-50 bg-black/20 backdrop:blur-2xl bg-opacity-40  `}>
                    <div className={` rounded-lg shadow-2xl  w-full max-w-md p-6 ${isDark ? 'bg-gray-700' : 'bg-white'} `}>
                        <h2 className={`text-lg ${isDark ? 'text-gray-100' : 'text-gray-800'} font-semibold mb-4`}>Share "{shareModal.note?.title || (shareModal.note?.content[0] || 'Untitled')}"</h2>
                        <input
                            type="email"
                            placeholder="Enter user email"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            className={`w-full border px-3 py-2 rounded-md mb-4 ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`}
                        />
                        <div className="mb-4">
                            <p className={`font-medium mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Permission</p>
                            <div className="flex items-center gap-6">
                                <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                    <input
                                        type="radio"
                                        name="permission"
                                        value="view"
                                        checked={sharePermission === "view"}
                                        onChange={() => setSharePermission("view")}
                                    /> View
                                </label>
                                <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
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
            {/* Menu for mobile screen */}
            {isMenuOpen && (
                <>
                    <div className="fixed flex inset-0 z-20">
                        <div
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/30"
                        ></div>
                    </div>
                    {/* sidebar  drawer*/}
                    <div onClick={() => setIsMenuOpen(false)} className="absolute top-18 w-64 z-45  bg-white h-full shadow-lg">
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
