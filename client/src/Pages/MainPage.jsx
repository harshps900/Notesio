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
import Trash from "../Components/Trash";
import FavNotes from '../Components/FavNotes'
import noteTa from '../assets/noteTa.png'
import DisplayNotes from "../Components/DisplayNotes";
import { useTheme } from "../Context/ThemeProvider";
import NoteColumn from "../Components/NoteColumn";
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
    const [isHomeCLick, setIsHomeClick] = useState(false);
    const [isFavouritesClick, setIsFavouritesClick] = useState(false);
    const [isTrashClick, setIsTrashClick] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [noteDetail, setNoteDetail] = useState(null); // State for the detail view modal
    const { isDark } = useTheme();
    const [color, setColor] = useState(false)
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
    useEffect(() => {
        setIsHomeClick(true);
    }, [])

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
                // add locally (server should also emit via socket)
                setNotes(prev => [res.data.note, ...prev]);
            }
        } catch (error) {
            console.log(error);
            showToast("Failed to create note", "error");
        }
    };

    // Generic update function
    const updateNote = async (noteId, updateData) => {
        // Optimistic UI update
        setNotes(prev => prev.map(n => n._id === noteId ? { ...n, ...updateData } : n));

        try {
            // The backend's editNote can handle partial updates with JSON
            const res = await axios.put(
                `http://localhost:4000/api/notes/edit/${noteId}`,
                updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                // Replace with the final version from the server
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
    const handleUpdateNote = async (formData) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description || ''); // Ensure description is not undefined
        if (formData.color) data.append("color", formData.color);
        if (formData.image && formData.image[0]) {
            data.append("image", formData.image[0]);
        }
        try {
            const res = await axios.put(
                `http://localhost:4000/api/notes/edit/${currentNote._id}`,
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
                        {}, // Add empty body for POST request
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (res.data.success) {
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
        // Now uses the generic updateNote function
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
        <div className={`w-full fixed h-screen flex flex-col ${isDark ? ' bg-gray-800' : 'bg-gray-100'}`}>
            <NavBar searchterm={searchterm} setSearchTerm={setSearchTerm} menu={toggleMenu} />
            <div className="flex flex-1  ">
                {/* sidebar */}
                <aside className="hidden md:block">
                    <SideBar
                        toggleHome={toggleHome} isHomeCLick={isHomeCLick}
                        toggleFavourites={toggleFavourites} isFavouritesClick={isFavouritesClick}
                        toggleTrash={toggleTrash} isTrashClick={isTrashClick}
                    />
                </aside>
                <div className=" flex-1 overflow-y-auto ">
                    {isHomeCLick && (
                        <>
                            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-2 mt-4  md:gap-6">
                                <NoteColumn
                                    notes={filteredNotes}
                                    onEdit={(e) => { e.stopPropagation(); perm === 'edit' && onEdit(note); }}
                                    permission={perm}
                                    noteDetail={() => setNoteDetail(note)}
                                    onDelete={(e) => { e.stopPropagation(); perm === 'edit' && onDelete(note._id); }}
                                    onToggleFavourite={(e, id, isFav) => { e.stopPropagation(); onToggleFavourite(id, isFav); }}
                                    onShare={(e, n) => { e.stopPropagation(); setShareModal({ open: true, note: n }); }}
                                    onColorChange={handleColorChange}

                                />
                                <NoteColumn
                                    notes={filteredNotes}
                                    onEdit={(e) => { e.stopPropagation(); perm === 'edit' && onEdit(note); }}
                                    permission={perm}
                                    noteDetail={() => setNoteDetail(favouriteNotes)}
                                    onDelete={(e) => { e.stopPropagation(); perm === 'edit' && onDelete(filteredNotes._id); }}
                                    onToggleFavourite={(e, id, isFav) => { e.stopPropagation(); onToggleFavourite(id, isFav); }}
                                    onShare={(e, n) => { e.stopPropagation(); setShareModal({ open: true, note: n }); }}
                                    onColorChange={handleColorChange}
                                />
                                <NoteColumn
                                    notes={filteredNotes}
                                    onEdit={(e) => { e.stopPropagation(); perm === 'edit' && onEdit(note); }}
                                    permission={perm}
                                    noteDetail={() => setNoteDetail(note)}
                                    onDelete={(e) => { e.stopPropagation(); perm === 'edit' && onDelete(note._id); }}
                                    onToggleFavourite={(e, id, isFav) => { e.stopPropagation(); onToggleFavourite(id, isFav); }}
                                    onShare={(e, n) => { e.stopPropagation(); setShareModal({ open: true, note: n }); }}
                                    onColorChange={handleColorChange}
                                />
                            </div> */}
                            {/* Notes grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-2 mt-4  md:gap-6">
                                {filteredNotes.length > 0 ? (
                                    filteredNotes.map((note) => {
                                        const perm = getPermission(note);
                                        return (
                                            <div key={note._id}  className="cursor-pointer">
                                                <NoteCard
                                                    note={note}
                                                    permission={perm}
                                                    noteDetail={() => setNoteDetail(note)}
                                                    onEdit={(e) => { e.stopPropagation(); perm === 'edit' && onEdit(note); }}
                                                    onDelete={(e) => { e.stopPropagation(); perm === 'edit' && onDelete(note._id); }}
                                                    onToggleFavourite={(e, id, isFav) => { e.stopPropagation(); onToggleFavourite(id, isFav); }}
                                                    onShare={(e, n) => { e.stopPropagation(); setShareModal({ open: true, note: n }); }}
                                                    onColorChange={handleColorChange}
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center mt-35 ml-80 h-full w-full overflow-hidden">
                                        <div className="rounded-full h-62 w-62 bg-indigo-100  ">
                                            <img src={noteTa} className="w-62 h-62 " />
                                        </div>
                                        <div className="flex flex-col text-center mt-6 h-full w-full">
                                            <p className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold mb-6`}>{searchterm ? "No notes match your search." : "No notes yet. Create one!"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </>
                    )}
                    {isFavouritesClick && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-2 mt-4  md:gap-6">
                            {favouriteNotes.length > 0 ? (
                                favouriteNotes.map((note) => {
                                    const perm = getPermission(note);
                                    return (
                                        <FavNotes
                                            key={note._id}
                                            note={note}
                                            permission={perm}
                                            noteDetail={() => setNoteDetail(note)}
                                            onEdit={() => perm === 'edit' && onEdit(note)}
                                            onDelete={() => perm === 'edit' && onDelete(note._id)}
                                            onToggleFavourite={onToggleFavourite}
                                            onShare={(n) => setShareModal({ open: true, note: n })}
                                        />
                                    );
                                })
                            ) : (
                                <div className="flex  flex-col  h-screen w-full">
                                    <h1 className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold mb-6`}> Favourite Notes</h1>
                                    <div className="flex flex-col items-center ml-80 justify-center h-full w-full">
                                        <p className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold mb-6`}>No favourite notes yet.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {isTrashClick && (
                        <Trash />
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
                    <div className={` rounded-2xl shadow-2xl w-full max-w-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className={`flex justify-between items-center border-b ${isDark ? ' border-gray-200 ' : 'border-gray-200'} pb-2 mb-4`}>
                            <p className={`text-xl font-semibold  ${isDark ? 'text-gray-100' : 'text-gray-800'} } `}>{currentNote ? `Edit Note` : "Create Note"}</p>
                            <button onClick={toggleNote} className={` hover:text-red-500 text-2xl ${isDark ? 'text-gray-100' : 'text-gray-400'}`}>×</button>
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

            {/* Note Detail Modal */}
            {noteDetail && (
                <div className={`fixed inset-0 z-50 flex  items-center justify-center `} onClick={() => setNoteDetail(null)}>
                    <DisplayNotes note={noteDetail} onClose={() => setNoteDetail(null)} />
                </div>
            )}

            {/* Share Note Modal */}
            {shareModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className={` rounded-lg shadow-xl w-full max-w-md p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}}`}>
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
                        />

                    </div>
                </>
            )}
        </div>
    );
}
