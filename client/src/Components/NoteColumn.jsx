import { useDroppable } from "@dnd-kit/core"
import NoteCard from "./NoteCard"
import { useTheme } from "../Context/ThemeProvider"

export default function NoteColumn({
    col,
    notes,
    getPermission,
    setNoteDetail,
    onEdit,
    onDelete,
    onToggleFavourite,
    onShare,
    onColorChange
}) {
    const { setNodeRef } = useDroppable({
        id: col.id
    })
    const { isDark } = useTheme();

    const titleColorMap = {
        onStart: `${isDark ? 'text-blue-700' : 'text-blue-600'}`,
        progress: `${isDark ? 'text-yellow-700' : 'text-yellow-600'}`,
        done: `${isDark ? 'text-green-700' : 'text-green-600'}`,
    };

    return (
        <>
            <div ref={setNodeRef} className={`  p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-200'}  rounded-lg w-80 h-full`}>
            <div className="flex flex-col gap-4">
                <div className={`text-2xl font-serif capitalize ${titleColorMap[col.id] || ''}`}>
                    {col.title} {notes.length > 0 && `(${notes.length})`}  
                </div>
                <div >
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
                        )
                    })}
                </div>
                </div>
            </div>
        </>
    )
}