import { useCallback, useEffect, useState } from "react"
import { fetchVideos, normalizeVideo, PAGE_SIZE } from "../api/videos"

const filterVideosByCategory = (videos, category) => {
	if (category === "All") return videos
	return videos.filter((video) => video.category === category)
}

const filterVideosBySearch = (videos, query) => {
	const normalizedQuery = query.trim().toLowerCase()
	if (!normalizedQuery) return videos

	return videos.filter((video) =>
		video.title?.toLowerCase().includes(normalizedQuery),
	)
}

const applyFilters = (videos, category, query) =>
	filterVideosBySearch(filterVideosByCategory(videos, category), query)

const dedupeVideos = (videos) =>
	Array.from(new Map(videos.map((video) => [video.id, video])).values())

export default function useHomeVideos() {
	const [allVideos, setAllVideos] = useState([])
	const [activeCategory, setActiveCategory] = useState("All")
	const [searchQuery, setSearchQuery] = useState("")
	const [loading, setLoading] = useState(true)
	const [hasMore, setHasMore] = useState(true)
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const [error, setError] = useState("")
	const [visibleVideos, setVisibleVideos] = useState([])

	const refreshVideos = useCallback(() => {
		setLoading(true)
		setError("")

		fetchVideos()
			.then(({ data }) => {
				const fetchedVideos = Array.isArray(data?.videos)
					? data.videos.map(normalizeVideo)
					: []
				const uniqueVideos = dedupeVideos(fetchedVideos)

				setAllVideos(uniqueVideos)
			})
			.catch((fetchError) => {
				console.error("Failed to fetch videos", fetchError)
				setAllVideos([])
				setError("Could not load videos from the API.")
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		refreshVideos()
	}, [refreshVideos])

	useEffect(() => {
		const filteredVideos = applyFilters(allVideos, activeCategory, searchQuery)
		setVisibleVideos(filteredVideos.slice(0, visibleCount))
		setHasMore(filteredVideos.length > visibleCount)
	}, [activeCategory, allVideos, searchQuery, visibleCount])

	const handleCategoryChange = (category) => {
		if (category === activeCategory) return
		setActiveCategory(category)
		setVisibleCount(PAGE_SIZE)
	}

	const handleSearchChange = (query) => {
		setSearchQuery(query)
		setVisibleCount(PAGE_SIZE)
	}

	const handleLoadMore = () => {
		setVisibleCount((previousCount) => previousCount + PAGE_SIZE)
	}

	return {
		videos: visibleVideos,
		loading,
		hasMore,
		error,
		searchQuery,
		handleCategoryChange,
		handleSearchChange,
		handleLoadMore,
	}
}
