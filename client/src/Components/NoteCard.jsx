import { useState, useRef, useEffect,  } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPencil, faTrash, faShareNodes, faEye, faClock, faStar,  faBars, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../Context/ThemeProvider";
import { format, isToday, isYesterday } from 'date-fns';
import { HexColorPicker } from "react-colorful";
import { useDraggable } from "@dnd-kit/core";
import color from '../assets/color.png'
import DownloadFile from "./DownloadFile";
import { PDFDownloadLink } from "@react-pdf/renderer";


export default function NoteCard({ note, onEdit, onDelete, onShare, onToggleFavourite, onColorChange, permission = null, noteDetail }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
                setIsColorPickerOpen(false);
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

    // Determines if a hex color is dark
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

    const { setNodeRef, attributes, listeners, transform } = useDraggable({
        id: note._id
    });

    const style = transform ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`
    } : undefined;

    // Handle click events to prevent propagation to drag listeners
    const handleMenuClick = (e) => {
        e.stopPropagation();
        if (!isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 160),
            });
        }
        setIsMenuOpen((prev) => !prev);
    };

    const handleColorPickerClick = (e) => {
        e.stopPropagation();
        setIsColorPickerOpen(prev => !prev);
    };

    const handleMenuItemClick = (e, action) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        action();
    };

    return (
        <div
            ref={setNodeRef}
            className={`rounded-xl p-5 border h-full shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative group`}
            style={{
                backgroundColor: noteColor,
                borderColor: isDark ? '#4A5568' : '#E2E8F0',
                ...style,
                transition: 'transform 0.1s ease-in-out',
            }}
        >
            {/* Drag handle - only this area should have drag listeners */}
            <div
                {...attributes}
                {...listeners}
                className={`absolute top-2 left-2 w-2 h-2 ${textColorClass}  cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity `}
                style={{ touchAction: 'none' }}
            >
                <FontAwesomeIcon icon={faBars} />
            </div>
            {/* Header with title and menu */}
            <div className="flex justify-between items-start mb-3">
                <h2
                    className={`text-lg font-semibold line-clamp-2 pr-6 capitalize cursor-pointer ${textColorClass}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        noteDetail();
                    }}
                >
                    {note.title || (note.content && note.content[0] ? `${note.content[0].substring(0, 30)}...` : 'Untitled Note')}
                </h2>
                <div className="relative flex">
                    {/* Custom color picker */}
                    
                        <div className="relative mr-2 ">
                            <button
                                onClick={handleColorPickerClick}
                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10 transition-colors"
                                title="Change note color"
                            >
                                <div className="flex  cursor-pointer relative" title="Change note color">
                                    <img src={color} draggable="false" alt="Color Picker" className="w-6 h-6 rounded-full object-cover" />

                                </div>
                            </button>
                            {isColorPickerOpen && (
                                <div
                                    ref={menuRef}
                                    className="absolute top-full -right-10 mt-2 z-50  p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <HexColorPicker
                                        color={note.color || generateColorForId(note._id)}
                                        onChange={(newColor) => onColorChange(note._id, newColor)}
                                    />
                                    <button
                                        className="mt-2 w-full text-sm px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsColorPickerOpen(false);
                                        }}>
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    
                    <button
                        ref={buttonRef}
                        className={`p-1.5 rounded-full ${isDark ? 'text-gray-100 hover:bg-white/20 hover:text-gray-100' : 'text-gray-200 hover:bg-white/50 hover:text-gray-700'} transition-colors`}
                        onClick={handleMenuClick}
                        aria-label="Note options"
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} size="sm" />
                    </button>
                    {isMenuOpen && (
                        <div
                            ref={menuRef}
                            className={`fixed shadow-2xl rounded-xl z-[100] w-40 py-1.5 border transition-all ${isDark ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-white text-slate-800 border-slate-200'}`}
                            style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                            }}
                        >
                            <button
                                onClick={(e) => handleMenuItemClick(e, () => canEdit && onEdit(note))}
                                disabled={!canEdit}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? `${isDark ? 'hover:bg-gray-700 cursor-pointer text-gray-100' : 'hover:bg-gray-50 cursor-pointer text-gray-700'}` : `${isDark ? 'opacity-50 cursor-not-allowed text-gray-200' : 'opacity-50 cursor-not-allowed text-gray-400'}`}`}
                            >
                                <FontAwesomeIcon icon={faPencil} className="mr-2 text-xs" />
                                Edit
                            </button>
                            <button
                                onClick={(e) => handleMenuItemClick(e, () => canEdit && onDelete(note._id))}
                                disabled={!canEdit}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? `${isDark ? 'hover:bg-gray-700 cursor-pointer text-gray-100' : 'hover:bg-gray-50 cursor-pointer text-gray-700'}` : `${isDark ? 'opacity-50 cursor-not-allowed text-gray-200' : 'opacity-50 cursor-not-allowed text-gray-400'}`}`}
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-2 text-xs" />
                                Delete
                            </button>
                            <button
                                onClick={(e) => handleMenuItemClick(e, () => canShare && onShare(e, note))}
                                disabled={!canShare}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${canEdit ? `${isDark ? 'hover:bg-gray-700 cursor-pointer text-gray-100' : 'hover:bg-gray-50 cursor-pointer text-gray-700'}` : `${isDark ? 'opacity-50 cursor-not-allowed text-gray-200' : 'opacity-50 cursor-not-allowed text-gray-400'}`}`}
                            >
                                <FontAwesomeIcon icon={faShareNodes} className="mr-2 text-xs" />
                                Share
                            </button>
                            <button
                                onClick={(e) => handleMenuItemClick(e, () => onToggleFavourite(note._id, !note.isFavourite))}
                                className={`w-full text-left mr-2 px-4 py-2 text-sm flex items-center cursor-pointer ${isDark ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-50'}`}
                            >
                                <FontAwesomeIcon icon={faStar} className="mr-2 text-xs" />
                                {note.isFavourite ? 'Unfavourite' : 'Favourite'}
                            </button>
                            <PDFDownloadLink
                                document={<DownloadFile note={note} />}
                                fileName={`${(note.title || (note.content && note.content[0]) || 'untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
                                style={{ textDecoration: 'none' }}
                            >
                                {({ loading }) => (
                                    <button
                                        disabled={loading}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center cursor-pointer ${isDark ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-50'}`}
                                    >
                                        <FontAwesomeIcon icon={faDownload} className="mr-2 text-xs" />
                                        {loading ? 'Preparing...' : 'Download'}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Note content */}
            <div className="flex-grow overflow-hidden mb-4">
                
                    <p
                        onClick={(e) => {
                            e.stopPropagation();
                            noteDetail();
                        }}
                        className={`text-sm line-clamp-1 leading-relaxed cursor-pointer ${textColorClass}`}
                    >
                        {note.description || (note.content && note.content[0]) || "No content provided."} 
                    </p>
                    
                
                {/* Image */}
                {note.imageUrl && (
                    <img
                        src={`http://localhost:4000${note.imageUrl}`}
                        alt={note.title}
                        className="hidden my-2 rounded-lg object-cover max-h-48 w-full cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            noteDetail();
                        }}
                    />
                )}

            </div>
            {/* Footer with metadata */}
            <div className="mt-auto pt-3 border-t border-white/50 flex justify-between items-center">
                <div className={`flex items-center text-xs ${textColorClass} ${isColorDark(noteColor) ? 'text-gray-200' : 'text-gray-500'}`}>
                    <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" />
                    <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                    {note.lastEditedBy && note.lastEditedBy.name && (
                        <span className="ml-2 italic">
                            (edited by {note.lastEditedBy.name})
                        </span>
                    )}
                </div>

                <button
                    className="hover:text-yellow-500 transition-color "
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite(note._id, !note.isFavourite);
                    }}
                >
                    <FontAwesomeIcon
                        icon={faStar}
                        className={`cursor-pointers ${textColorClass} ${note.isFavourite ? `${isDark ? 'text-yellow-600' : 'text-yellow-500'}` : `${isDark ? '' : ''}`}`}
                    />
                </button>
                {permission === 'view' && (
                    <div className={`flex items-center text-xs text-blue-600 bg-blue-100 px-1 py-1 rounded-full ${textColorClass}`}>
                        <FontAwesomeIcon icon={faEye} className="mr-1 text-xs" />
                        <span>View only</span>
                    </div>
                )}
            </div>
        </div>
    );
}