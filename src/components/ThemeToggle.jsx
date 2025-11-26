const [isDarkMode, setIsDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [isDarkMode]);
