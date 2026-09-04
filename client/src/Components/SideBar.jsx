import { useTheme } from "../Context/ThemeProvider"
import { Home, Star, Trash2, Moon, Sun, LayoutDashboard } from "lucide-react"

export default function SideBar({
    toggleHome, isHomeCLick,
    toggleFavourites, isFavouritesClick,
    toggleTrash, isTrashClick,
}) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <aside className={`w-64 h-full flex flex-col justify-between p-4 transition-colors duration-300 ${isDark ? 'bg-slate-900/90 text-slate-100 border-r border-slate-800' : 'bg-slate-50/90 text-slate-800 border-r border-slate-200/80'}`}>
            {/* Top Navigation Links */}
            <div className="flex flex-col gap-2 pt-2">
               

                <button
                    onClick={toggleHome}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                        isHomeCLick 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 font-semibold' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <Home className="w-4 h-4" />
                    <span>All Notes</span>
                </button>

                <button
                    onClick={toggleFavourites}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                        isFavouritesClick 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 font-semibold' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                    <Star className={`w-4 h-4 ${isFavouritesClick ? 'fill-white' : ''}`} />
                    <span>Favourites</span>
                </button>

                <button
                    onClick={toggleTrash}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                        isTrashClick 
                            ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/20 font-semibold' 
                            : 'text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300'
                    }`}
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Trash</span>
                </button>
            </div>

            {/* Bottom Theme Switcher */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isDark 
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                            : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                        <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500">
                        Toggle
                    </span>
                </button>
            </div>
        </aside>
    )
}