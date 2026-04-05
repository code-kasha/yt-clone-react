import axios from "axios"
import { createContext, useEffect, useMemo, useState } from "react"

export const AuthContext = createContext()

const decodeToken = (token) => {
	try {
		const payload = token.split(".")[1]
		if (!payload) return null

		const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/")
		const paddedPayload =
			normalizedPayload + "=".repeat((4 - (normalizedPayload.length % 4)) % 4)
		const decodedPayload = JSON.parse(window.atob(paddedPayload))

		if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
			return null
		}

		return decodedPayload
	} catch {
		return null
	}
}

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => {
		if (typeof window === "undefined") return ""
		return window.localStorage.getItem("authToken") || ""
	})
	const [user, setUser] = useState(() => {
		if (typeof window === "undefined") return null

		const storedToken = window.localStorage.getItem("authToken")
		const storedUser = window.localStorage.getItem("currentUser")
		const decodedToken = storedToken ? decodeToken(storedToken) : null

		if (!decodedToken) return null
		if (storedUser) {
			try {
				return JSON.parse(storedUser)
			} catch {
				return {
					id: decodedToken.userId || decodedToken.id || "",
					username: decodedToken.username || "",
					email: decodedToken.email || "",
				}
			}
		}

		return {
			id: decodedToken.userId || decodedToken.id || "",
			username: decodedToken.username || "",
			email: decodedToken.email || "",
		}
	})

	useEffect(() => {
		const decodedToken = token ? decodeToken(token) : null

		if (token && !decodedToken) {
			setToken("")
			setUser(null)
			window.localStorage.removeItem("authToken")
			window.localStorage.removeItem("currentUser")
			delete axios.defaults.headers.common.Authorization
			return
		}

		if (token) {
			window.localStorage.setItem("authToken", token)
			axios.defaults.headers.common.Authorization = `Bearer ${token}`
		} else {
			window.localStorage.removeItem("authToken")
			delete axios.defaults.headers.common.Authorization
		}
	}, [token])

	useEffect(() => {
		if (user) {
			window.localStorage.setItem("currentUser", JSON.stringify(user))
		} else {
			window.localStorage.removeItem("currentUser")
		}
	}, [user])

	const login = ({ token: nextToken, user: nextUser }) => {
		setToken(nextToken)
		setUser(nextUser)
	}

	const logout = () => {
		setToken("")
		setUser(null)
	}

	const value = useMemo(
		() => ({
			user,
			token,
			login,
			logout,
			isAuthenticated: Boolean(token && user),
		}),
		[token, user],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

