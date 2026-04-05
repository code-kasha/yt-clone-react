import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { registerServiceWorker } from "./utils/sw-register"
import { BrowserRouter } from "react-router-dom"

// Register the service worker once during startup so the app can support offline caching.
registerServiceWorker()

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* BrowserRouter owns navigation/history for the whole app before App mounts any routes. */}
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
)
