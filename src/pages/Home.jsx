import { useState, useContext } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import FilterBar from "../components/FilterBar"
import VideoGrid from "../components/VideoGrid"
import { UIContext } from "../context/UIContext"

// Mock data - replace with API calls
const mockVideos = [
	{
		id: 1,
		title: "Learn React in 2024 - Complete Guide",
		channel: "Code Masters",
		thumbnail: "https://via.placeholder.com/320x180?text=React",
		views: 125000,
		category: "Education",
	},
	{
		id: 2,
		title: "Gaming Highlights - Best Moments",
		channel: "Pro Gamer",
		thumbnail: "https://via.placeholder.com/320x180?text=Gaming",
		views: 89000,
		category: "Gaming",
	},
	{
		id: 3,
		title: "Cooking Pasta Like An Italian Chef",
		channel: "Chef Marco",
		thumbnail: "https://via.placeholder.com/320x180?text=Cooking",
		views: 234000,
		category: "Cooking",
	},
	{
		id: 4,
		title: "Music Production Basics",
		channel: "Beat Master",
		thumbnail: "https://via.placeholder.com/320x180?text=Music",
		views: 56000,
		category: "Music",
	},
	{
		id: 5,
		title: "Latest Tech News - April 2024",
		channel: "Tech Daily",
		thumbnail: "https://via.placeholder.com/320x180?text=Tech",
		views: 178000,
		category: "Technology",
	},
	{
		id: 6,
		title: "Morning Comedy Sketches",
		channel: "Funny People",
		thumbnail: "https://via.placeholder.com/320x180?text=Comedy",
		views: 445000,
		category: "Comedy",
	},
	{
		id: 7,
		title: "Sports Highlights - Championship 2024",
		channel: "Sports Central",
		thumbnail: "https://via.placeholder.com/320x180?text=Sports",
		views: 567000,
		category: "Sports",
	},
	{
		id: 8,
		title: "Entertainment News This Week",
		channel: "Pop Culture Daily",
		thumbnail: "https://via.placeholder.com/320x180?text=Entertainment",
		views: 234000,
		category: "Entertainment",
	},
]

export default function Home() {
	const { sidebarOpen } = useContext(UIContext)
	const [filteredVideos, setFilteredVideos] = useState(mockVideos)
	const [loading, setLoading] = useState(false)

	const handleCategoryChange = (category) => {
		setLoading(true)
		// Simulate API delay
		setTimeout(() => {
			if (category === "All") {
				setFilteredVideos(mockVideos)
			} else {
				setFilteredVideos(mockVideos.filter((v) => v.category === category))
			}
			setLoading(false)
		}, 300)
	}

	return (
		<div className="flex flex-col h-screen bg-white">
			{/* Header */}
			<Header />

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<Sidebar />

				{/* Main Content */}
				<main
					className={`flex-1 flex flex-col overflow-auto bg-gray-50 transition-all duration-300 ${
						sidebarOpen ? "ml-56" : "ml-0"
					}`}
				>
					{/* Filter Bar */}
					<FilterBar onCategoryChange={handleCategoryChange} />

					{/* Video Grid */}
					<VideoGrid videos={filteredVideos} isLoading={loading} />
				</main>
			</div>
		</div>
	)
}
