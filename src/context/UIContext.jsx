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
	const [authToken, setAuthToken] = useState(() => {
		if (typeof window === "undefined") return ""
		return window.localStorage.getItem("authToken") || ""
	})
	const [currentUser, setCurrentUser] = useState(() => {
		if (typeof window === "undefined") return null
		const savedUser = window.localStorage.getItem("currentUser")
		return savedUser ? JSON.parse(savedUser) : null
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

	useEffect(() => {
		if (authToken) {
			window.localStorage.setItem("authToken", authToken)
		} else {
			window.localStorage.removeItem("authToken")
		}
	}, [authToken])

	useEffect(() => {
		if (currentUser) {
			window.localStorage.setItem("currentUser", JSON.stringify(currentUser))
		} else {
			window.localStorage.removeItem("currentUser")
		}
	}, [currentUser])

	const toggleSidebar = () => setSidebarOpen((prev) => !prev)
	const closeSidebar = () => setSidebarOpen(false)
	const openSidebar = () => setSidebarOpen(true)
	const toggleTheme = () => setDarkMode((prev) => !prev)
	const login = ({ token, user }) => {
		setAuthToken(token)
		setCurrentUser(user)
	}
	const logout = () => {
		setAuthToken("")
		setCurrentUser(null)
	}

	return (
		<UIContext.Provider
			value={{
				sidebarOpen,
				toggleSidebar,
				closeSidebar,
				openSidebar,
				darkMode,
				toggleTheme,
				authToken,
				currentUser,
				login,
				logout,
			}}
		>
			{children}
		</UIContext.Provider>
	)
}
