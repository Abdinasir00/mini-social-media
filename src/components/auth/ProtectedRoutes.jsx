import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute ({children, requireAuth}) {

const {isAuthenticated, status} = useSelector((state)=> state.auth)
if (status === "loading") {
    return (
        <div className="flex justify-center items-center h-32">
    
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}

if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace/>
} 

if (!requireAuth && isAuthenticated) {
    return <Navigate to="/create" replace/>
}

return children;

}

export default ProtectedRoute;
