import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPencil, faTrash, faShareNodes, faEye, faClock, faStar, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../Context/ThemeProvider";
import { API_BASE_URL } from "../config";
import { format, isToday, isYesterday } from 'date-fns';
import Speech from 'react-text-to-speech'
export default function DisplayNotes({ note, onClose }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { isDark } = useTheme();
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(note.description || (note.content && note.content[0]));

        setUtterance(u);

        return () => {
            synth.cancel();
        };
    }, [note.description, note.content]);
    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (isPaused) {
            synth.resume();
        }

        synth.speak(utterance);

        setIsPaused(false);
    };

    const handlePause = () => {
        const synth = window.speechSynthesis;

        synth.pause();

        setIsPaused(true);
    };

    const handleStop = () => {
        const synth = window.speechSynthesis;

        synth.cancel();

        setIsPaused(false);
    };



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
        <div className={`relative rounded-2xl shadow-xl border max-w-xl md:max-w-3xl p-6 ${isDark ? ' bg-gray-800 border-gray-100' : 'bg-white'} transition-all duration-200 flex flex-col relative group`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between border-b border-gray-400 pb-2 items-start mb-4">
                <h2 className={`text-2xl font-serif  ${isDark ? 'text-gray-100' : 'text-gray-800 '} capitalize`}>{note.title||(note.content && note.content[0]?`${note.content[0].substring(0,8)}...`: 'Untitled Note')}</h2>
                <div className="flex items-center gap-3">
                    <button className={` p-2 rounded-2xl cursor-pointer   ${isDark ? 'text-gray-100 bg-indigo-600 hover:bg-indigo-500' : 'text-gray-800 bg-indigo-400 hover:bg-indigo-500 '} `} onClick={handlePlay}>{isPaused ? "Resume" : "Play"} <FontAwesomeIcon icon={faPlay} className={`${isDark ? 'text-gray-100' : 'text-gray-800 '}`} /></button>
                    <button className={` p-2 rounded-2xl cursor-pointer  ${isDark ? 'text-gray-100  bg-amber-500 hover:bg-amber-400 ' : 'text-gray-800 bg-amber-300 hover:bg-amber-400 '} `} onClick={handlePause}>Pause <FontAwesomeIcon icon={faPause} className={`${isDark ? 'text-gray-100' : 'text-gray-800 '}`} /></button>
                    <button className={` p-2 rounded-2xl cursor-pointer ${isDark ? 'text-gray-100 bg-red-600 hover:bg-red-500' : 'text-geray-700 bg-red-400 hover:bg-red-500'}`} onClick={handleStop}>Stop <FontAwesomeIcon icon={faStop } className={`${isDark ? 'text-gray-100' : 'text-gray-800 '}`}/></button>
                    <button onClick={onClose} className={` hover:text-red-500 ${isDark ? 'text-gray-100' : 'text-gray-800 '} text-2xl leading-none`}>×</button>
                </div>
            </div>
            <div className={` ${isDark ? 'text-gray-100' : 'text-gray-800 '} max-w-none font-normal  mb-6 overflow-y-auto max-h-[50vh]`}>

                <p className="text-justify ">{note.description || (note.content && note.content[0]?`${note.content[0].substring(8,)}`: 'No content provided.')}</p>
            </div>
            {note.imageUrl && (
                <img src={`${API_BASE_URL}${note.imageUrl}`} alt={note.title} draggable="false" className="mb-4 rounded-lg object-cover max-h-[30%] max-w-[60%] items-center" />
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