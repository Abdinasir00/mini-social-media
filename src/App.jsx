// import NotificationsList from "./pages/NotificationsList";
import Create from "./pages/Create";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";

// import Notification from "./pages/Notification"
// import Create from "./pages/Create"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NotificationsList from "./pages/NotificationsList";
import ProtectedRoute from "./components/auth/ProtectedRoutes";

function App() {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const mainClassName = useMemo(
    () =>
      [
        "flex-grow",
        "px-4",
        "py-6",
        "transition-colors",
        "duration-300",
        isAuthenticated ? "md:ml-[250px]" : "",
      ]
        .filter(Boolean)
        .join(" "),
    [isAuthenticated]
  );

  // Loading spinner
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      {/* <Navbar user={currentUser.name} avatar={currentUser.avatar} /> */}
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className={mainClassName}>
         <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute requireAuth={true}>
                <Home />
              </ProtectedRoute>
            }
          />
            <Route
              path="/register"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              }
            />
          
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />

   

            <Route
              path="/search"
              element={
                <ProtectedRoute requireAuth={true}>
                  <SearchPage />
                </ProtectedRoute>
              }
            />



            <Route
              path="/notifications"
              element={
                <ProtectedRoute requireAuth={true}>
                  <NotificationsList />
                </ProtectedRoute>
              }
            />

      

            <Route
              path="/create"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Create />
                </ProtectedRoute>
              }
            />

     

            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth={true}>
                  <Profile />
                </ProtectedRoute>
              }
            />
  

          
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
