import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { registerServiceWorker } from "./utils/sw-register"
import { BrowserRouter } from "react-router-dom"

// Register service worker for offline support and caching
registerServiceWorker()

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
)
