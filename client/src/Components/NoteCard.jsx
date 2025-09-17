import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEllipsis } from "@fortawesome/free-solid-svg-icons";

export default function NoteCard({ note, onEdit, onDelete, onShare }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const generateColorForId = (id) => {
        const colors = [
            "bg-yellow-200", "bg-green-300", "bg-blue-200",
            "bg-pink-300", "bg-purple-200", "bg-indigo-300",
            "bg-teal-300", "bg-red-300"
        ];
        let total = 0;
        for (let i = 0; i < id.length; i++) {
            total += id.charCodeAt(i);
        }
        return colors[total % colors.length];
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    return (
        <div className={`rounded-lg p-4 ${generateColorForId(note._id)} contain-content h-auto shadow-md relative flex flex-col`}>
            {/* Note content */}
            <div className="flex-grow overflow-auto ">
                <h2 className="text-xl font-bold mb-2 font-sans capitalize border-b border-gray-900 pb-2 text-gray-800">{note.title}</h2>
                <span className="flex gap-1 ">
                    {/* <FontAwesomeIcon icon={faClock} className="font-light text-gray-500 py-1" /> */}
                    {/* <p className="text-gray-500 font-light">{formatDate ? `Created at: ${formatDate(note.createdAt)}` : `updated at: ${formatDate(note.updatedAt)}`}</p>
                    {console.log(note.updatedAt)} */}
                    {/* <p>Created: {formatDate(note.createdAt)}</p>
                    {note.updatedAt !== note.createdAt && (
                        <p>Updated: {formatDate(note.updatedAt)}</p>
                    )} */}
                </span>
                <p className="text-gray-700 font-serif capitalize mt-2  ">{note.description}</p>
            </div>
            {/* Ellipsis  */}
            <div
                className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                <FontAwesomeIcon icon={faEllipsis} rotation={90} />
            </div>
            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-8 right-2 bg-white shadow-lg rounded-md z-10 w-32">
                    <ul className="text-sm text-gray-700">
                        <li
                            onClick={() => { setIsMenuOpen(false); onEdit(note); }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            Edit
                        </li>
                        <li
                            onClick={() => { setIsMenuOpen(false); onDelete(note._id); }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            Delete
                        </li>
                        <li
                            onClick={() => { setIsMenuOpen(false); onShare(note); }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            Share
                        </li>
                    </ul>
                </div>
            )}

            {/* Footer with metadata */}
            {/* <div className="mt-4 pt-2 border-t border-gray-500 border-opacity-30 text-xs text-gray-600">
                <p>Created: {formatDate(note.createdAt)}</p>
                {note.updatedAt !== note.createdAt && (
                    <p>Updated: {formatDate(note.updatedAt)}</p>
                )}
            </div> */}
        </div>
    );
}
