import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../Context/AuthProvider";
import { io } from "socket.io-client";
import { useTheme } from "../Context/ThemeProvider";
import {DndContext,} from "@dnd-kit/core";
import axios from "axios";
import NavBar from "../Components/NavBar";
import Form from "../Components/ReusableComponents/Form";
import NoteField from "../Components/ReusableComponents/NoteField";
import swal from "sweetalert";
import SideBar from "../Components/SideBar";
import Trash from "../Components/Trash";
import FavNotes from '../Components/FavNotes'
import noteTa from '../assets/noteTa.png'
import DisplayNotes from "../Components/DisplayNotes";
import NoteColumn from '../Components/NoteColumn'

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
    const [isHomeCLick, setIsHomeClick] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isFavouritesClick, setIsFavouritesClick] = useState(false);
    const [isTrashClick, setIsTrashClick] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // other states
    const { isDark } = useTheme();
    const { showToast, user } = useAuth();
    const [searchterm, setSearchTerm] = useState("");
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
        data.append("tags",formData.tags)
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
            if (newStatus === 'progress') {
                showToast("Note status Changed to Progress.", "success");
            }
            if (newStatus === 'done') {
                showToast("Note status Changed to Done.", "success");
            }
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

    const noteCol = [
        { id: 'onStart', title: 'onStart' },
        { id: 'progress', title: 'Progress' },
        { id: 'done', title: 'Done' }
    ]

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


    return (
        <div className={`w-full  md:fixed h-screen flex flex-col ${isDark ? ' bg-gray-800' : 'bg-white'}`}>
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
                            <div className=' p-6 md:p-4 h-screen'>
                                <div className=' flex gap-4 flex-wrap  '>
                                    <DndContext onDragEnd={handleDragEnd}>
                                        {filteredNotes.length > 0 ? (
                                            noteCol.map((col) => {
                                                const notesInColumn = filteredNotes.filter(note => note.status === col.id || (!note.status && col.id === 'onStart'));
                                                return (
                                                    <NoteColumn
                                                        key={col.id}
                                                        col={col}
                                                        notes={notesInColumn}
                                                        getPermission={getPermission}
                                                        setNoteDetail={setNoteDetail}
                                                        onEdit={(note) => onEdit(note)}
                                                        onDelete={(id) => onDelete(id)}
                                                        onToggleFavourite={onToggleFavourite}
                                                        onShare={(e, n) => { e.stopPropagation(); setShareModal({ open: true, note: n }); }}
                                                        onColorChange={handleColorChange}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <>
                                                {isHomeCLick && !searchterm && (
                                                    <div className="flex flex-col items-center justify-center mt-35 ml-80 h-full w-full overflow-hidden">
                                                        <div className="rounded-full h-62 w-62 bg-indigo-100  ">
                                                            <img src={noteTa} className="w-62 h-62 " />
                                                        </div>
                                                        <div className="flex flex-col text-center mt-6 h-full w-full">
                                                            <p className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold mb-6`}>{searchterm ? "No notes match your search." : "No notes yet. Create one!"}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </DndContext>
                                </div>
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
                                            onEdit={() => onEdit(note)}
                                            onDelete={() => onDelete(note._id)}
                                            onToggleFavourite={onToggleFavourite}
                                            onShare={() => setShareModal({ open: true, note: note })}
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
                            onSubmit={(v) => { currentNote ? handleUpdateNote(v, currentNote._id) : handleCreateNote(v); }}
                            initialValue={currentNote}
                            buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                            buttonText={currentNote ? "Edit Note" : "Create Note"}
                        />
                    </div>
                </div>
            )}

            {/* Note Detail Modal */}
            {noteDetail && (
                <div className={`fixed inset-0 z-50 flex  items-center justify-center  `} onClick={() => setNoteDetail(null)}>
                    <DisplayNotes note={noteDetail} onClose={() => setNoteDetail(null)} />
                </div>
            )}

            {/* Share Note Modal */}
            {shareModal.open && (
                <div className={`fixed flex items-center justify-center inset-0 z-50 bg-black/20 backdrop:blur-2xl bg-opacity-40  `}>
                    <div className={` rounded-lg shadow-2xl  w-full max-w-md p-6 ${isDark ? 'bg-gray-700' : 'bg-white'} `}>
                        <h2 className={`text-lg ${isDark ? 'text-gray-100' : 'text-gray-800'} font-semibold mb-4`}>Share "{shareModal.note?.title ?? ''}"</h2>
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
                        />

                    </div>
                </>
            )}
        </div>
    );
}
