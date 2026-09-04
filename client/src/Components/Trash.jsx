import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashRestore, faTrash, faClock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Context/AuthProvider";
import swal from "sweetalert";
import { format, isToday, isYesterday } from 'date-fns';
import { useTheme } from "../Context/ThemeProvider";
import trashp from '../assets/trashp.png'
import { API_BASE_URL } from "../config";

export default function Trash({ onNoteRestored }) {
    const [trash, setTrash] = useState([]);
    const { showToast } = useAuth();
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchTrashData = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/notes/trash`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (data.success) {
                    setTrash(Array.isArray(data.note) ? data.note : []);
                }
            } catch (error) {
                console.log("Error fetching trash data:", error);
            }
        };

        fetchTrashData();
    }, []);
    const onPermanentDelete = async (id) => {
        try {
            swal({
                title: 'Are you sure?',
                text: "This will delete the Note Permanently !",
                icon: 'warning',
                dangerMode: true,
                buttons: ["Cancel", "Yes"],
            }).then(async (willDelete) => {
                if (!willDelete) return; {
                    const res = await axios.delete(
                        `${API_BASE_URL}/api/notes/delete/${id}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (res.data.success) {
                        showToast("Note deleted permanently", "success");
                        setTrash(prev => prev.filter(n => n._id !== id));
                    }
                }
            });
        } catch (error) {
            console.log(error);
            showToast("Failed to delete note", "error");
        }
    };

    const onRestore = async (id) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/notes/restore/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                showToast("Note restored successfully", "success");
                setTrash(prev => prev.filter(n => n._id !== id));
                if (onNoteRestored) onNoteRestored(res.data.note);
            }
        } catch (error) {
            showToast("Failed to restore note", "error");
        }
    }

    const generateColorForId = (id) => {
        const colors = [
            `${isDark ? 'bg-yellow-500 border-yellow-400 ' : 'bg-yellow-300 border-yellow-200 '}`,
            `${isDark ? 'bg-green-500 border-green-400 ' : 'bg-green-200 border-green-200 '}`,
            `${isDark ? 'bg-blue-500 border-blue-400 ' : 'bg-blue-400 border-blue-200 '}`,
            `${isDark ? 'bg-pink-500 border-pink-400 ' : 'bg-pink-400 border-pink-200 '}`,
            `${isDark ? 'bg-purple-500 border-purple-400 ' : 'bg-purple-400 border-purple-200 '}`,
            `${isDark ? 'bg-indigo-500 border-indigo-400 ' : 'bg-indigo-200 border-indigo-200 '}`,
            `${isDark ? 'bg-teal-500 border-teal-400 ' : 'bg-teal-200 border-teal-200 '}`,
            `${isDark ? 'bg-red-500 border-red-400' : 'bg-red-200 border-red-200 '}`,
            `${isDark ? 'bg-orange-500 border-orange-400 ' : 'bg-orange-200 border-orange-200 '}`,
            `${isDark ? 'bg-cyan-500 border-cyan-400 ' : 'bg-cyan-200 border-cyan-200 '}`,
        ];
        let total = 0;
        for (let i = 0; i < String(id).length; i++) {
            total += String(id).charCodeAt(i);
        }
        return colors[total % colors.length];
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        if (isToday(date)) return `Today at ${format(date, 'hh:mm a')}`;
        if (isYesterday(date)) return `Yesterday at ${format(date, 'hh:mm a')}`;

        const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return `${format(date, 'EEE')} at ${format(date, 'hh:mm a')}`;

        return format(date, 'MMM d, yyyy');
    };

    const handleAllDelete = async () => {
        try {
            swal({
                title: 'Are you sure?',
                text: "This will delete the Note Permanently !",
                icon: 'warning',
                dangerMode: true,
                buttons: ["Cancel", "Yes"],
            }).then(async (willDelete) => {
                if (!willDelete) return; {
                    const res = await axios.delete(`${API_BASE_URL}/api/notes/deleteAll`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    })
                    if (res.data.success) {
                        showToast("All notes deleted permanently", "success");
                        setTrash([]);
                    }
                }
            })

        } catch (error) {
            console.log(error);
            showToast("Failed to delete all notes", "error");
        }
    }


    return (
        <>
            <div className="p-6 w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl ${isDark ? 'text-gray-100' : 'text-gray-800'} font-bold `}>Trash</h1>
                    <button onClick={handleAllDelete} className={` rounded-2xl cursor-pointer p-2  ${isDark ? 'text-gray-100 hover:bg-gray-900 ' : 'text-gray-800'} `}>
                        <FontAwesomeIcon icon={faTrash} /> Clear All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {trash.length > 0 ? (
                        trash.map((note) => (
                            <div key={note._id} className={`rounded-xl p-5 ${generateColorForId(note._id)} border h-full shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative group`}>
                                <div>
                                    <h3 className={`text-lg font-semibold  line-clamp-2 pr-6 capitalize ${isDark ? 'text-gray-100 ' : 'text-gray-800 '}`}>{note.title||(note.content && note.content[0] ? `${note.content[0].substring(0, 30)}...` : 'Untitled Note')}</h3>
                                    <p className={`text-sm line-clamp-1 leading-relaxed ${isDark ? 'text-gray-100 ' : 'text-gray-800 '}`}>{note.description||(note.content && note.content[0]) || "No content provided."}</p>
                                    {note.imageUrl && (
                                        <img draggable="false" src={`${API_BASE_URL}${note.imageUrl}`} alt={note.title} className="my-3 rounded-lg object-cover max-h-48 w-full" />
                                    )}
                                </div>
                                <div className="mt-auto pt-3 border-t border-white/50 flex justify-between items-center">
                                    <div className={`flex items-center text-xs ${isDark ? 'text-gray-100 ' : 'text-gray-500 '}`}>
                                        <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                                        <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onRestore(note._id)} className={` cursor-pointer ${isDark ? ' text-gray-700 hover:text-green-500' : 'text-gray-800 hover:text-green-600'} `}>
                                            <FontAwesomeIcon icon={faTrashRestore} />
                                        </button>
                                        <button onClick={() => onPermanentDelete(note._id)} className={`text-gray-500 cursor-pointer  ${isDark ? ' text-gray-700 hover:text-red-600' : 'text-gray-800 hover:text-red-600'} `}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-30 ml-110 h-full w-full overflow-hidden">
                            <div className="rounded-full h-62 w-62 bg-indigo-200  ">
                                <img draggable="false" src={trashp} className="w-62 h-62 " />
                            </div>
                            <div className="flex flex-col   h-full w-full">
                                <p className={`font-serif text-2xl col-span-full ${isDark ? 'text-gray-100' : 'text-gray-800'} text-center mt-8`}> No Notes here yet</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}