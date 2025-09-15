import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthProvider"
import Loading from "./Loader"
import Loader from "./Loader";
export default function ProtectedRoute({ children }) {
    let { isLoggedIn, loading } = useAuth()

    if (loading) {
        return <Loader />;
    }

    if (isLoggedIn) {
        return <Navigate to='/login' />
    } else {
        return children
    }
}
