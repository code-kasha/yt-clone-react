import { useEffect, useMemo, useState } from "react"
import { AuthContext } from "./AuthContextValue"

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
		const storedToken = window.localStorage.getItem("authToken") || ""
		return decodeToken(storedToken) ? storedToken : ""
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

	const decodedToken = useMemo(
		() => (token ? decodeToken(token) : null),
		[token],
	)
	const isAuthenticated = Boolean(token && user && decodedToken)

	useEffect(() => {
		if (decodedToken) {
			window.localStorage.setItem("authToken", token)
		} else {
			window.localStorage.removeItem("authToken")
		}
	}, [decodedToken, token])

	useEffect(() => {
		if (user && decodedToken) {
			window.localStorage.setItem("currentUser", JSON.stringify(user))
		} else {
			window.localStorage.removeItem("currentUser")
		}
	}, [decodedToken, user])

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
			isAuthenticated,
		}),
		[isAuthenticated, token, user],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
