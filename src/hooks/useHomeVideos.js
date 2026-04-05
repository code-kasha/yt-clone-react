import { useCallback, useEffect, useState } from "react"
import { fetchVideos, normalizeVideo, PAGE_SIZE } from "../api/videos"

const filterVideosByCategory = (videos, category) => {
	if (category === "All") return videos
	return videos.filter((video) => video.category === category)
}

const dedupeVideos = (videos) =>
	Array.from(new Map(videos.map((video) => [video.id, video])).values())

export default function useHomeVideos() {
	const [allVideos, setAllVideos] = useState([])
	const [visibleVideos, setVisibleVideos] = useState([])
	const [activeCategory, setActiveCategory] = useState("All")
	const [loading, setLoading] = useState(true)
	const [hasMore, setHasMore] = useState(true)
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const [error, setError] = useState("")

	const refreshVideos = useCallback((category = activeCategory) => {
		setLoading(true)
		setError("")

		fetchVideos()
			.then(({ data }) => {
				const fetchedVideos = Array.isArray(data?.videos)
					? data.videos.map(normalizeVideo)
					: []
				const uniqueVideos = dedupeVideos(fetchedVideos)
				const nextFilteredVideos = filterVideosByCategory(uniqueVideos, category)

				setAllVideos(uniqueVideos)
				setVisibleCount(PAGE_SIZE)
				setVisibleVideos(nextFilteredVideos.slice(0, PAGE_SIZE))
				setHasMore(nextFilteredVideos.length > PAGE_SIZE)
			})
			.catch((fetchError) => {
				console.error("Failed to fetch videos", fetchError)
				setAllVideos([])
				setVisibleVideos([])
				setError("Could not load videos from the API.")
				setHasMore(false)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [activeCategory])

	useEffect(() => {
		refreshVideos(activeCategory)
	}, [activeCategory, refreshVideos])

	const handleCategoryChange = (category) => {
		if (category === activeCategory) return
		setActiveCategory(category)
		setLoading(true)
	}

	const handleLoadMore = () => {
		const nextVisibleCount = visibleCount + PAGE_SIZE
		const filteredVideos = filterVideosByCategory(allVideos, activeCategory)
		setVisibleCount(nextVisibleCount)
		setVisibleVideos(filteredVideos.slice(0, nextVisibleCount))
		setHasMore(filteredVideos.length > nextVisibleCount)
	}

	return {
		videos: visibleVideos,
		loading,
		hasMore,
		error,
		handleCategoryChange,
		handleLoadMore,
	}
}
