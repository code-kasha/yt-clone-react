// router/router.jsx
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"

function Router() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<h1>Login</h1>} />
			<Route path="/video/:id" element={<h1>Video Player</h1>} />
		</Routes>
	)
}

export default Router
