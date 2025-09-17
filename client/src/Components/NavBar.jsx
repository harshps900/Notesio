import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAuth } from "../Context/AuthProvider"
import { useNavigate } from "react-router-dom"
import { faS, faSearch } from "@fortawesome/free-solid-svg-icons"
export default function NavBar({ searchterm, setSearchTerm }) {
    const { user, isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()

    return (
        <>
            <nav className="sticky flex items-center  justify-between px-2 py-3 shadow-md bg-white">
                {/* logo */}
                <p className="text-blue-500 font-extrabold text-xl ">Notes.io</p>
                <ul className="flex justify-between items-center gap-6">
                    <li className=" relative ">
                        <input type="text" placeholder="Search Notes..."
                        value={searchterm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-2 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-1 "
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-4"/>
                    </li>
                    {!user ? (
                        <>
                            <li className="flex  justify-between items-center gap-4">
                                <button onClick={() => { navigate('/login') }} className="rounded-2xl bg-indigo-500 hover:bg-indigo-600 px-2 py-1  text-gray-50">Login</button>
                                <button onClick={() => { navigate('/register') }} className="rounded-2xl bg-indigo-500 hover:bg-indigo-600 px-2 py-1  text-gray-50">Register</button>
                            </li>
                        </>) :
                        (
                            <>
                                <li className="flex  justify-between items-center gap-4">
                                    <p className="text-gray-500 font-bold text-xl">Welcome {user.name} </p>
                                    <button onClick={() => { logout(); navigate('/login'); }} className="rounded-2xl bg-indigo-500 hover:bg-indigo-600 px-2 py-1  text-gray-50">Logout</button>
                                </li>
                            </>)}

                </ul>
            </nav>
        </>
    )
}