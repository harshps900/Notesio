import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPencil, faTrash, faShareNodes, faEye, faClock, faEdit } from "@fortawesome/free-solid-svg-icons";
import { format, isToday, isYesterday } from 'date-fns';
import { useTheme } from "../Context/ThemeProvider";
import { API_BASE_URL } from "../config";

export default function FavNote({ note, onEdit, onDelete, onShare, permission = null, noteDetail }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { isDark } = useTheme();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const generateColorForId = (id) => {
        const colors = [
            isDark ? '#4A5568' : '#E2E8F0', // gray
            isDark ? '#9B2C2C' : '#FEB2B2', // red
            isDark ? '#975A16' : '#FBD38D', // orange
            isDark ? '#B7791F' : '#F6E05E', // yellow
            isDark ? '#2F855A' : '#9AE6B4', // green
            isDark ? '#2C7A7B' : '#81E6D9', // teal
            isDark ? '#2B6CB0' : '#90CDF4', // blue
            isDark ? '#553C9A' : '#B794F4', // purple
            isDark ? '#97266D' : '#FBB6CE', // pink
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

    const canEdit = permission === 'edit';
    const canShare = permission === 'edit' || permission === 'view';

    const isColorDark = (hexColor) => {
        if (!hexColor) return false;
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
    };

    const noteColor = note.color || generateColorForId(note._id);
    const textColorClass = isColorDark(noteColor) ? 'text-gray-100' : 'text-gray-800';

    return (
        <div className={`rounded-xl p-5 border h-full shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative group`} style={{ backgroundColor: noteColor, borderColor: isDark ? '#4A5568' : '#E2E8F0' }}>
                    {/* Header with title and menu */}
                    <div className="flex justify-between items-start mb-3">
                <h2 className={`text-lg font-semibold pr-6 capitalize cursor-pointer ${textColorClass}`} onClick={noteDetail}>
                    {note.title || (note.content && note.content[0] ? `${note.content[0].substring(0, 30)}...` : 'Untitled Note')}
                        </h2>
                        <div
                            ref={menuRef}
                            className="relative"
                        >
                            <button
                                className={`p-1.5 rounded-full  ${isDark ? 'text-gray-100 hover:bg-white/20 hover:text-gray-100' : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'} transition-colors`}
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                aria-label="Note options"
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} size="sm" />
                            </button>
                            {isMenuOpen && (
                                <div className={`absolute top-8 right-0  shadow-lg rounded-lg z-10 w-40 py-1 border ${isDark ? 'bg-gray-800  text-gray-100 border-gray-500' : 'bg-white text-gray-800 border-gray-50'}`}>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); if (canEdit) onEdit(note); }}
                                        disabled={!canEdit}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? `${isDark ? 'hover:bg-gray-700 cursor-pointer text-gray-100' : 'hover:bg-gray-50 cursor-pointer text-gray-700'}` : `${isDark ? 'opacity-50 cursor-not-allowed text-gray-200' : 'opacity-50 cursor-not-allowed text-gray-400'}`}`}
                                    >
                                        <FontAwesomeIcon icon={faPencil} className="mr-2 text-xs" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); if (canEdit) onDelete(note._id); }}
                                        disabled={!canEdit}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? `${isDark ? 'hover:bg-gray-700 cursor-pointer text-gray-100' : 'hover:bg-gray-50 cursor-pointer text-gray-700'}` : `${isDark ? 'opacity-50 cursor-not-allowed text-gray-200' : 'opacity-50 cursor-not-allowed text-gray-400'}`}`}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="mr-2 text-xs" />
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); if (canShare) onShare(note); }}
                                        disabled={!canShare}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? `${isDark ? 'hover:bg-gray-700 cursor-pointer text-gray-100' : 'hover:bg-gray-50 cursor-pointer text-gray-700'}` : `${isDark ? 'opacity-50 cursor-not-allowed text-gray-200' : 'opacity-50 cursor-not-allowed text-gray-400'}`}`}
                                    >
                                        <FontAwesomeIcon icon={faShareNodes} className="mr-2 text-xs" />
                                        Share
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-grow overflow-hidden mb-0">
                <p onClick={noteDetail} className={`text-sm line-clamp-1 leading-relaxed cursor-pointer ${textColorClass}`}>
                    {note.description || (note.content && note.content[0]) || "No content provided."}
                        </p>
                    </div>
                    {note.imageUrl && (
                        <img src={`${API_BASE_URL}${note.imageUrl}`} alt={note.title} className="my-3 hidden rounded-lg object-cover max-h-48 w-full" />
                    )}
                    {/* Note content */}

                    {/* Footer with metadata */}
                    <div className="mt-auto pt-3 border-t border-white/50 flex justify-between items-center">
                <div className={`flex items-center text-xs ${textColorClass} ${isColorDark(noteColor) ? 'text-gray-200' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                            <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                        </div>

                        {permission === 'view' && (
                            <div className="flex items-center text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                <FontAwesomeIcon icon={faEye} className="mr-1 text-xs" />
                                <span>View only</span>
                            </div>

                        )}
                    </div>
        </div>
    );
}