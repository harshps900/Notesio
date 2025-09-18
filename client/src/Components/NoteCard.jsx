import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPencil, faTrash, faShareNodes, faEye, faClock, faEdit } from "@fortawesome/free-solid-svg-icons";
import { format, isToday, isYesterday } from 'date-fns';

export default function NoteCard({ note, onEdit, onDelete, onShare, permission = null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
            "bg-yellow-200 border-yellow-200",
            "bg-green-200 border-green-200",
            "bg-blue-200 border-blue-200",
            "bg-pink-200 border-pink-200",
            "bg-purple-200 border-purple-200",
            "bg-indigo-200 border-indigo-200",
            "bg-teal-200 border-teal-200",
            "bg-red-200 border-red-200",
            "bg-orange-200 border-orange-200",
            "bg-cyan-200 border-cyan-200"
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

    return (
        <div className={`rounded-xl p-5 ${generateColorForId(note._id)} border h-full shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative group`}>
            {/* Header with title and menu */}
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 pr-6 capitalize">
                    {note.title}
                </h2>
                <div
                    ref={menuRef}
                    className="relative"
                >
                    <button
                        className="p-1.5 rounded-full text-gray-500 hover:bg-white/50 hover:text-gray-700 transition-colors"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label="Note options"
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} size="sm" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg z-10 w-40 py-1 border">
                            <button
                                onClick={() => { setIsMenuOpen(false); if (canEdit) onEdit(note); }}
                                disabled={!canEdit}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? 'hover:bg-gray-50 cursor-pointer text-gray-700' : 'opacity-50 cursor-not-allowed text-gray-400'}`}
                            >
                                <FontAwesomeIcon icon={faPencil} className="mr-2 text-xs" />
                                Edit
                            </button>
                            <button
                                onClick={() => { setIsMenuOpen(false); if (canEdit) onDelete(note._id); }}
                                disabled={!canEdit}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? 'hover:bg-gray-50 cursor-pointer text-gray-700' : 'opacity-50 cursor-not-allowed text-gray-400'}`}
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-2 text-xs" />
                                Delete
                            </button>
                            <button
                                onClick={() => { setIsMenuOpen(false); if (canShare) onShare(note); }}
                                disabled={!canShare}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${canShare ? 'hover:bg-gray-50 cursor-pointer text-gray-700' : 'opacity-50 cursor-not-allowed text-gray-400'}`}
                            >
                                <FontAwesomeIcon icon={faShareNodes} className="mr-2 text-xs" />
                                Share
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Note content */}
            <div className="flex-grow overflow-hidden mb-4">
                <p className="text-gray-600 text-sm line-clamp-5 leading-relaxed">
                    {note.description}
                </p>
            </div>

            {/* Footer with metadata */}
            <div className="mt-auto pt-3 border-t border-white/50 flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
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