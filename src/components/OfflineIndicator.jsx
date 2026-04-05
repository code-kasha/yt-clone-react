import { useState, useEffect } from "react"
import { getOnlineStatus, setOnlineStatusListener } from "../utils/sw-register"
import "./OfflineIndicator.css"

export default function OfflineIndicator() {
	const [isOnline, setIsOnline] = useState(() => getOnlineStatus())

	useEffect(() => {
		// Listen for online/offline changes
		setOnlineStatusListener((isOnlineStatus) => {
			setIsOnline(isOnlineStatus)
		})
	}, [])

	if (isOnline) {
		return null
	}

	return (
		<div className="offline-indicator">
			<div className="offline-indicator__content">
				<svg
					className="offline-indicator__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<span className="offline-indicator__text">You are offline</span>
			</div>
		</div>
	)
}
