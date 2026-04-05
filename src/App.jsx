import OfflineIndicator from "./components/OfflineIndicator"
import Router from "./router"
import { UIProvider } from "./context/UIContext"

function App() {
	return (
		<UIProvider>
			<OfflineIndicator />
			<Router />
		</UIProvider>
	)
}

export default App
