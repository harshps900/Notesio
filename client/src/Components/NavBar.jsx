import { useAuth } from "../Context/AuthProvider"
import { useNavigate } from "react-router-dom"
export default function NavBar(){
    const {logout} = useAuth()
    const navigate = useNavigate()

    return(
        <>
        <nav className="sticky flex items-center  justify-between px-2 py-3 shadow-md bg-white">
            {/* logo */}
            <p className="text-blue-500 font-extrabold text-xl ">Notes.io</p>
            <ul className="flex justify-between items-center gap-6">
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
                <li>
                    <button onClick={()=>{logout(), navigate('/login')}} className="rounded-2xl bg-indigo-500 hover:bg-indigo-600 px-2 py-1  text-gray-50">Logout</button>
                </li>
            </ul>
        </nav>
        </>
    )
}