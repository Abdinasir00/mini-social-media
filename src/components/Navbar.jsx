import { Link, useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../store/slices/notificationSlice";


import {logoutUser } from "../store/slices/auth"; 

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, status, user } = useSelector((state) => state.auth);

  // Qaado notifications array ka state-ka
  const notifications = useSelector((state) => state.notifications.notifications);

  // Xisaabi unreadCount gudaha component-kan
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      // Haddii aad leedahay thunk userLogout, isticmaalkiisa halkan
      await dispatch(logoutUser()).unwrap();
      // Haddii kale, tusaale nadiifi token iyo redirect:
      // localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white text-black shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
              C
            </span>
            <h1 className="text-2xl font-bold">ConnectHub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-6 items-center">
              {isAuthenticated && (
                <>
                  {/* Notifications Button */}
                  <li>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="relative p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <Bell className="h-7 w-7 text-gray-700" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Profile Link */}
                  <li>
                    <Link to="/profile" className="flex items-center gap-x-2">
                      <img
                      src={user?.avatarUrl}
                      className="h-10 w-10 rounded-full object-cover"
                      alt="avatar"
                    />

                      <span className="text-base font-medium text-black">
                        {user?.name || "User"}
                      </span>
                    </Link>
                  </li>

                  {/* Logout Button */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-800 rounded-lg hover:bg-blue-100 transition"
                    >
                      <LogOut className="h-5 w-5 text-black-700 font-800" />
                    
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && isAuthenticated && (
          <nav className="md:hidden bg-white shadow-md">
            <ul className="flex flex-col space-y-2 p-4">
              <li>
                <Link to="/profile" className="flex items-center gap-x-2">
                  <img
                    src="https://rb.gy/fbxvbz"
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">
                    {user?.name || "User"}
                  </span>
                </Link>
              </li>

              <li>
                <button
                  onClick={() => navigate("/notifications")}
                  className="flex items-center gap-x-2 relative"
                >
                  <Bell className="h-5 w-5 text-gray-700" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 left-24 h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button onClick={handleLogout} className="flex items-center gap-x-2">
                  <LogOut className="h-5 w-5 text-gray-700" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="mt-20"></div>
    </>
  );
};

export default Navbar;
