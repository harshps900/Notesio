import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAuth } from "../Context/AuthProvider"
import { useNavigate } from "react-router-dom"
import { faSearch,  } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
export default function NavBar({ searchterm, setSearchTerm }) {
    const { user, isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-gray-100">
            {/* Logo */}
            <div   
                className="flex items-center cursor-pointer" 
                onClick={() => navigate("/Notesio")}
            >
                <div className="bg-indigo-600 text-white rounded-lg w-9 h-9 flex items-center justify-center mr-2">
                    <span className="font-bold text-lg">N</span>
                </div>
                <p className="text-indigo-600 font-bold text-xl hidden sm:block">Notes.io</p>
            </div>

            {/* Search Bar - Only show when logged in */}
            {user && (
                <div className="flex-1 max-w-2xl mx-4 md:mx-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search notes..."
                            value={searchterm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                            className="px-4 py-2 text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/register')} 
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Register
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            <span className="text-gray-700 font-medium hidden md:block">
                                {user.name || 'User'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-600">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        logout(); 
                                        navigate('/login');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-400 font-serif hover:bg-gray-50 transition-colors"
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