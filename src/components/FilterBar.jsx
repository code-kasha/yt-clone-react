import axios from "axios"
import { useEffect, useState } from "react"

const CATEGORIES_URL = "http://localhost:5000/api/categories"
const FALLBACK_CATEGORIES = [
	"All",
	"Tech",
	"Gaming",
	"Music",
	"Education",
	"Entertainment",
	"Sports",
	"Other",
]

const normalizeCategories = (data) => {
	const rawCategories = Array.isArray(data)
		? data
		: Array.isArray(data?.categories)
			? data.categories
			: []

	const normalizedCategories = rawCategories
		.map((category) => {
			if (typeof category === "string") return category
			return category?.name || category?.categoryName || category?.title || null
		})
		.filter(Boolean)

	const mergedCategories = ["All", ...normalizedCategories]
	const uniqueCategories = [...new Set(mergedCategories)]

	return uniqueCategories.length >= 6 ? uniqueCategories : FALLBACK_CATEGORIES
}

export default function FilterBar({ onCategoryChange }) {
	const [activeCategory, setActiveCategory] = useState("All")
	const [categories, setCategories] = useState(FALLBACK_CATEGORIES)

	useEffect(() => {
		axios
			.get(CATEGORIES_URL)
			.then(({ data }) => {
				setCategories(normalizeCategories(data))
			})
			.catch((error) => {
				console.error("Failed to load categories", error)
				setCategories(FALLBACK_CATEGORIES)
			})
	}, [])

	const handleCategoryClick = (category) => {
		if (category === activeCategory) return
		setActiveCategory(category)
		onCategoryChange?.(category)
	}

	return (
		<div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:border-gray-800 dark:bg-[#121212]/95 dark:supports-backdrop-filter:bg-[#121212]/80">
			<div className="mx-auto flex w-full max-w-[1600px] gap-2 overflow-x-auto px-3 py-3 scrollbar-hide xxs:px-4 sm:gap-3 sm:px-5">
				{categories.map((category) => (
					<button
						key={category}
						onClick={() => handleCategoryClick(category)}
						className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
							activeCategory === category
								? "bg-gray-900 text-white dark:bg-white dark:text-[#121212]"
								: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-[#272727] dark:text-gray-100 dark:hover:bg-[#3a3a3a]"
						}`}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	)
}
