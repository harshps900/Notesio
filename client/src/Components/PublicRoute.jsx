import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import Loading from "./Loader";
export default function PublicRoute({ children }) {
    const { user,loading } = useAuth();
    if (loading) {
        return <Loading />;
    }

    if (user) {
        return <Navigate to="/Notesio"  />;
    } else {
        return children;
    }
}