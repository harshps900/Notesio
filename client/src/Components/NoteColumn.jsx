import { useDroppable } from "@dnd-kit/core"
import { useState } from "react"
import NoteCard from "./NoteCard"
import { useTheme } from "../Context/ThemeProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, {
    accordionDetailsClasses,
} from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
export default function NoteColumn({
    col,
    notes,
    getPermission,
    setNoteDetail,
    onEdit,
    onDelete, 
    onToggleFavourite,
    onShare,
    onColorChange,
    onDeleteStatus
}) {
    const { setNodeRef } = useDroppable({
        id: col.id
    })
    
    const { isDark } = useTheme();

    const titleColorMap = {
        onStart: `${isDark ? 'text-blue-700' : 'text-blue-600'}`,
        progress: `${isDark ? 'text-yellow-600' : 'text-yellow-500'}`,
        done: `${isDark ? 'text-green-700' : 'text-green-600'}`,

    };
    const [expanded, setExpanded] = useState('');

    const handleExpansion = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    return (
        <div ref={setNodeRef} className={`p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg  w-full md:w-65 h-145`}>
            {/* Desktop View */}
            <div  className="hidden md:flex md:flex-col gap-4">
                <div className="flex items-center justify-between mb-4 group">
                    <p className={`text-2xl font-serif capitalize ${titleColorMap[col.id] || ''}`}>{col.title} {notes.length > 0 && `(${notes.length})`}</p>
                    {!['onStart', 'progress', 'done'].includes(col.id) && (
                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => onDeleteStatus(col.id)} className="text-sm cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-500" />
                    )}
                </div>
                <div>
                    {notes.map((note) => {
                        const permission = getPermission(note);
                        return (
                            <div key={note._id} className="cursor-pointer mb-4">
                                <NoteCard
                                    note={note}
                                    permission={permission}
                                    noteDetail={() => setNoteDetail(note)}
                                    onEdit={(n) => onEdit(n)}
                                    onDelete={(id) => onDelete(id)}
                                    onToggleFavourite={onToggleFavourite}
                                    onShare={onShare}
                                    onColorChange={onColorChange}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* mobile view */}
            {/* <div className="md:hidden flex flex-col gap-4">
                
                    <div className="flex items-center justify-between mb-4 group">
                        <p className={`text-2xl font-serif capitalize ${titleColorMap[col.id] || ''}`}>{col.title} {notes.length > 0 && `(${notes.length})`}</p>
                        {!['onStart', 'progress', 'done'].includes(col.id) && (
                            <FontAwesomeIcon icon={faTrashAlt} onClick={() => onDeleteStatus(col.id)} className="text-sm cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-500" />
                        )}
                    </div>
                    <div>
                        {notes.map((note) => {
                            const permission = getPermission(note);
                            return (
                                <div key={note._id} className="cursor-pointer mb-4">
                                    <NoteCard
                                        note={note}
                                        permission={permission}
                                        noteDetail={() => setNoteDetail(note)}
                                        onEdit={(n) => onEdit(n)}
                                        onDelete={(id) => onDelete(id)}
                                        onToggleFavourite={onToggleFavourite}
                                        onShare={onShare}
                                        onColorChange={onColorChange}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div> */}
            </div>
    )
}