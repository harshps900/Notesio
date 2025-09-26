import { useEffect, useState } from "react"
import NavBar from "../Components/NavBar"
import UserSideBar from "../Components/UserSideBar"
import { useTheme } from "../Context/ThemeProvider"
import axios from "axios"

const API_BASE_URL = "http://localhost:4000/api";

export default function UserDashboard() {
    const { isDark } = useTheme()
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'profile', 'settings'
    const [notes, setNotes] = useState([])

    const toggleUserHome = () => {
        setActiveTab('home');
    }
    const toggleProfile = () => {
        setActiveTab('profile');
    }
    const toggleSettings = () => {
        setActiveTab('settings');
    }

    // fetch notes
    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const { data } = await axios.get(`${API_BASE_URL}/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(Array.isArray(data.note) ? data.note : []);
        } catch (error) {
            console.log("fetchNotes error:", error);
            setNotes([]); // Set to empty array on error
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const sharedNotesCount = notes.filter(note => note.shareWith && note.shareWith.length > 0).length;
    const favoriteNotesCount = notes.filter(note => note.isFavorite).length;

    return (
        <div className={`w-full  md:fixed h-screen flex flex-col ${isDark ? ' bg-gray-800' : 'bg-white'}`}>
            {/* header */}
            <NavBar />
            <div className="flex flex-1  ">
                <aside className="   hidden md:block">
                    <UserSideBar
                        isUserHomeClick={activeTab === 'home'} toggleUserHome={toggleUserHome}
                        isProfileClick={activeTab === 'profile'} toggleProfile={toggleProfile}
                        isSettingsClick={activeTab === 'settings'} toggleSettings={toggleSettings}
                    />
                </aside>
                <div className=" flex-1  overflow-y-auto ">
                    {activeTab === 'home' && (
                        // Home page content ananlysis
                        <div className=' p-6 md:p-4 h-screen'>
                            <div className=" flex justify-center items-center mt-4 gap-2 ">
                                {/* no of notes created  */}
                                <div className="w-full p-2 md:p-4  flex flex-col items-center justify-center bg-white rounded-3xl  hover:scale-105 transition-all duration-150 shadow-xl">
                                    <p className="text-2xl md:text-3xl font-bold text-center mt-2">
                                        {notes.length}
                                        </p>
                                        <p>Note Created</p>
                                </div>
                                {/* no of notes shared */}
                                <div className="w-full p-2 md:p-4  flex flex-col items-center justify-center bg-white rounded-3xl  hover:scale-105 transition-all duration-150 shadow-xl">
                                    <p className="text-2xl md:text-3xl font-bold text-center mt-2">
                                        {sharedNotesCount}
                                    </p>
                                    <p>Notes Shared</p>
                                </div>
                                {/* no of notes favourites */}
                                <div className="w-full p-2 md:p-4  flex flex-col items-center justify-center bg-white rounded-3xl  hover:scale-105 transition-all duration-150 shadow-xl">
                                    <p className="text-2xl md:text-3xl font-bold text-center mt-2">
                                        {favoriteNotesCount}
                                    </p>
                                    <p>Favorites</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}