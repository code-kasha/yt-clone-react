import { useContext } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import FilterBar from "../components/FilterBar"
import VideoGrid from "../components/VideoGrid"
import { UIContext } from "../context/UIContext"
import useHomeVideos from "../hooks/useHomeVideos"

export default function Home() {
	const { sidebarOpen } = useContext(UIContext)
	const {
		videos,
		loading,
		hasMore,
		error,
		handleCategoryChange,
		handleLoadMore,
	} = useHomeVideos()

	return (
		<div className="flex h-screen flex-col bg-white dark:bg-[#0f0f0f]">
			<Header />

			<div className="flex flex-1 overflow-hidden">
				<Sidebar />

				<main
					className={`flex min-w-0 flex-1 flex-col overflow-y-auto bg-gray-50 transition-[margin] duration-300 dark:bg-[#121212] ${
						sidebarOpen ? "md:ml-60" : "md:ml-24"
					}`}
				>
					<FilterBar onCategoryChange={handleCategoryChange} />
					<VideoGrid
						videos={videos}
						isLoading={loading}
						hasMore={hasMore}
						isLoadingMore={false}
						onLoadMore={handleLoadMore}
						error={error}
					/>
				</main>
			</div>
		</div>
	)
}
