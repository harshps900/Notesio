import { createContext, useContext, useState, useEffect } from "react";
const themeContext = createContext();

export const useTheme = () => useContext(themeContext);

export default function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDark(true);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("theme", isDark ? "dark" : "light");
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark])
    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };
    return (
        <>
            <themeContext.Provider value={{ isDark, toggleTheme }}>
                {children}
            </themeContext.Provider>
        </>
    )
}