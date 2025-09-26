import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAuth } from "../Context/AuthProvider"
import { useNavigate } from "react-router-dom"
import { faSearch, } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "../Context/ThemeProvider"
export default function NavBar({ searchterm, setSearchTerm, menu }) {
    const { user, isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { isDark } = useTheme()
    return (
        <nav className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3  shadow-sm border-b  ${isDark ? ' bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-100'}`}>
            {/* Logo */}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    navigate("/Notesio"),
                        menu()
                }}
            >
                <div className={` text-white rounded-lg w-9 h-9 flex items-center justify-center mr-2${isDark ? ' bg-indigo-400' : ' bg-indigo-600'}`}>
                    <span className="font-bold text-lg">N</span>
                </div>
                <p className={`text-indigo-600 font-bold text-xl hidden sm:block ${isDark ? ' text-indigo-400' : 'text-indigo-600'}`}>Notes.io</p>
            </div>

            {/* Search Bar - Only show when logged in */}
            {user && (
                <div className="flex-1 max-w-2xl mx-4 md:mx-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className={`${isDark ? ' text-gray-700' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchterm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 border ${isDark ? ' border-gray-500 focus:ring-indigo-800 focus:border-indigo-800 text-gray-100' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800'} rounded-lg focus:ring-2  transition-colors`}
                        />
                    </div>
                </div>
            )}

            {/* User Actions */}
            <div className="flex items-center">
                
                {!user ? (
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => navigate('/login')} 
                            className={`px-4 py-2 text-indigo-600 font-medium rounded-md   transition-colors`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/register')} 
                            className={`px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700  transition-colors shadow-sm`}
                        >
                            Register
                        </button>
                        <button onClick={() => navigate('/LandingPage')} className={`px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700  transition-colors shadow-sm`}>
                            Go Back
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 ${isDark?'hover:bg-indigo-200':'hover:bg-gray-200'} transition-colors`}
                        >
                            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            <span className={` font-medium hidden md:block ${isDark?'text-gray-200 hover:text-gray-800':'text-gray-700'}`}>
                                {user.name || 'User'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-48  rounded-md shadow-lg py-1 border  ${isDark?'bg-gray-800 border-gray-600 ':'bg-white border-gray-200 '} z-50`}>
                                <div className={`px-4 py-2 border-b  ${isDark?'border-gray-600':'border-gray-100'}`}>
                                    <p className={`text-sm ${isDark?'text-gray-200 ':'text-gray-600 '}`}>Signed in as</p>
                                    <p onClick={() => navigate('/UserDashboard')} className={`text-sm font-medium  ${isDark?'text-gray-200 ':'text-gray-900 '} truncate`}>{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        logout(); 
                                        navigate('/login');
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm text-red-400 font-serif  transition-colors${isDark?' hover:bg-gray-700 ':'hover:bg-gray-50'}`}
                                >
                                    Logout <FontAwesomeIcon icon={faRightFromBracket} className="ml-2 text-red-400" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </nav>
    )
}