import { createContext, useEffect, useState } from "react"

export const UIContext = createContext()

export function UIProvider({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(() => {
		if (typeof window === "undefined") return true
		return window.innerWidth >= 768
	})
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window === "undefined") return false
		const savedTheme = window.localStorage.getItem("theme")
		if (savedTheme) return savedTheme === "dark"
		return window.matchMedia("(prefers-color-scheme: dark)").matches
	})

	useEffect(() => {
		const handleResize = () => {
			setSidebarOpen(window.innerWidth >= 768)
		}

		handleResize()
		window.addEventListener("resize", handleResize)

		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode)
		window.localStorage.setItem("theme", darkMode ? "dark" : "light")
	}, [darkMode])

	const toggleSidebar = () => setSidebarOpen((prev) => !prev)
	const closeSidebar = () => setSidebarOpen(false)
	const openSidebar = () => setSidebarOpen(true)
	const toggleTheme = () => setDarkMode((prev) => !prev)

	return (
		<UIContext.Provider
			value={{
				sidebarOpen,
				toggleSidebar,
				closeSidebar,
				openSidebar,
				darkMode,
				toggleTheme,
			}}
		>
			{children}
		</UIContext.Provider>
	)
}
