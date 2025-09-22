import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPencil, faTrash, faShareNodes, faEye, faClock, faStar } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../Context/ThemeProvider";
import { format, isToday, isYesterday } from 'date-fns';
export default function DisplayNotes({ note, onClose }) {
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


    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        if (isToday(date)) return `Today at ${format(date, 'hh:mm a')}`;
        if (isYesterday(date)) return `Yesterday at ${format(date, 'hh:mm a')}`;

        const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return `${format(date, 'EEE')} at ${format(date, 'hh:mm a')}`;

        return format(date, 'MMM d, yyyy');
    };

    return (
        <div className={`rounded-xl p-5 border h-auto w-2xl  shadow-sm hover:shadow-md ${isDark ? ' bg-gray-800' : 'bg-gray-100'} transition-all duration-200 flex flex-col relative group`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
                <h2 className={`text-2xl font-bold  ${isDark ? 'text-gray-100' : 'text-gray-800 '} capitalize`}>{note.title}</h2>
                
                <button onClick={onClose} className={` hover:text-red-500 ${isDark ? 'text-gray-100' : 'text-gray-800 '} text-2xl leading-none`}>×</button>
            </div>
            <div className={` ${isDark ? 'text-gray-100' : 'text-gray-800 '} max-w-none  mb-6 overflow-y-auto max-h-[50vh]`}>
                <p className="text-justify ">{note.description}</p>
            </div>
            {note.imageUrl && (
                <img src={`http://localhost:4000${note.imageUrl}`} alt={note.title} className="mb-4 rounded-lg object-cover max-h-[30%] max-w-[60%] items-center" />
            )}
            <div className={`mt-auto pt-3 border-t flex justify-between items-center text-xs  ${isDark ? 'text-gray-100 border-t-gray-500' : 'text-gray-800 border-t-gray-500'}`}>
                <span>Last updated: {formatDate(note.updatedAt || note.createdAt)}</span>
                {note.lastEditedBy && note.lastEditedBy.name && (
                    <span className="italic">
                        (edited by {note.lastEditedBy.name})
                    </span>
                )}
            </div>
        </div>
    )
}