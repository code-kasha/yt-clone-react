import OfflineIndicator from "./components/OfflineIndicator"
import Router from "./router"
import { AuthProvider } from "./context/AuthContext"
import { UIProvider } from "./context/UIContext"

function App() {
	return (
		<AuthProvider>
			<UIProvider>
				<OfflineIndicator />
				<Router />
			</UIProvider>
		</AuthProvider>
	)
}

export default App
