import { useAuth } from "../Context/AuthProvider"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useTheme } from "../Context/ThemeProvider"
import { Search, LogOut, User as UserIcon, Sparkles, Menu, Shield } from "lucide-react"

export default function NavBar({ searchterm, setSearchTerm, menu }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { isDark } = useTheme()

    return (
        <nav className={`sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white/80 border-slate-200/80 text-slate-900'}`}>
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={menu}
                    className="p-2 rounded-xl md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => navigate("/Notesio")}
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        N
                    </div>
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent hidden sm:inline-block">
                        Notes.io
                    </span>
                </div>
            </div>

            {/* Middle: Search Bar (Only shown when logged in) */}
            {user && (
                <div className="flex-1 max-w-xl mx-4 md:mx-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search notes by title, tags, or content..."
                            value={searchterm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border outline-none transition-all duration-200 ${
                                isDark 
                                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                                    : 'bg-slate-100/70 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                            }`}
                        />
                    </div>
                </div>
            )}

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
                {!user ? (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            Log In
                        </button>
                        <button 
                            onClick={() => navigate('/register')} 
                            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md transition-all duration-200"
                        >
                            Sign Up
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2.5 p-1.5 rounded-xl transition-all duration-200 border cursor-pointer ${
                                isDark 
                                    ? 'border-slate-800 hover:bg-slate-800 text-slate-200' 
                                    : 'border-slate-200/80 hover:bg-slate-100 text-slate-800'
                            }`}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="font-semibold text-sm hidden md:inline-block">
                                {user.name || 'User'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-2 border z-50 transition-all ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}>
                                <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Signed in as</p>
                                    <p 
                                        onClick={() => { navigate('/UserDashboard'); setIsDropdownOpen(false); }}
                                        className="text-sm font-bold truncate hover:text-indigo-500 cursor-pointer mt-0.5"
                                    >
                                        {user.email}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <button 
                                        onClick={() => { navigate('/Dashboard'); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Sparkles className="w-4 h-4 text-indigo-500" />
                                        <span>Analytics Dashboard</span>
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/UserDashboard'); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                        <span>Profile Settings</span>
                                    </button>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-800 pt-1">
                                    <button 
                                        onClick={() => {
                                            logout(); 
                                            navigate('/login');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-500 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    >
                                        <span>Log Out</span>
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Backdrop for closing dropdown */}
            {isDropdownOpen && (
                <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </nav>
    )
}