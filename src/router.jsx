// router/router.jsx
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VideoPlayer from "./pages/VideoPlayer"

function Router() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/video/:id" element={<VideoPlayer />} />
			<Route path="/channel/:id" element={<h1>Channel Page</h1>} />
		</Routes>
	)
}

export default Router
