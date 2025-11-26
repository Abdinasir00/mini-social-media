import { Link, useNavigate } from "react-router-dom";
import { LogOut, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../store/slices/notificationSlice";
import { logoutUser } from "../store/slices/auth";

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 🌙 Dark/Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  // Apply dark class to <html> when isDarkMode changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add("dark");
      body?.classList.add("bg-gray-950");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      body?.classList.remove("bg-gray-950");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const { isAuthenticated, status, user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.notifications);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchNotifications());
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
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
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
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
                  {/* Theme Toggle Button */}
                  <li>
                    <button
                      onClick={toggleTheme}
                      aria-pressed={isDarkMode}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 border border-transparent hover:border-blue-400 transition-colors duration-200"
                      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {isDarkMode ? (
                        <Sun className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <Moon className="h-6 w-6 text-gray-800" />
                      )}
                    </button>
                  </li>

                  {/* Notifications */}
                  <li>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                    >
                      <Bell className="h-7 w-7 text-gray-700 dark:text-gray-300" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Profile */}
                  <li>
                    <Link to="/profile" className="flex items-center gap-x-2">
                      <img
                        src={user?.avatarUrl}
                        className="h-10 w-10 rounded-full object-cover"
                        alt="avatar"
                      />
                      <span className="text-base font-medium">{user?.name || "User"}</span>
                    </Link>
                  </li>

                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition"
                    >
                      <LogOut className="h-5 w-5" />
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
              className="text-gray-800 dark:text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && isAuthenticated && (
          <nav className="md:hidden bg-white dark:bg-gray-900 shadow-md">
            <ul className="flex flex-col space-y-2 p-4">
              {/* Theme Toggle Mobile */}
              <li>
                <button
                  onClick={toggleTheme}
                  aria-pressed={isDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center gap-2 transition-colors duration-200"
                >
                  {isDarkMode ? <Sun /> : <Moon />}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </li>

              <li>
                <Link to="/profile" className="flex items-center gap-x-2">
                  <img src={user?.avatarUrl} alt="avatar" className="h-8 w-8 rounded-full" />
                  <span>{user?.name || "User"}</span>
                </Link>
              </li>

              <li>
                <button
                  onClick={() => navigate("/notifications")}
                  className="flex items-center gap-x-2 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 left-24 h-5 w-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button onClick={handleLogout} className="flex items-center gap-x-2">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Spacer */}
      <div className="mt-20"></div>
    </>
  );
};

export default Navbar;
