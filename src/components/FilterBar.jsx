import { useState } from "react"

const CATEGORIES = [
	"All",
	"Music",
	"Gaming",
	"Entertainment",
	"Sports",
	"Technology",
	"Education",
	"News",
	"Comedy",
	"Cooking",
]

export default function FilterBar({ onCategoryChange }) {
	const [activeCategory, setActiveCategory] = useState("All")

	const handleCategoryClick = (category) => {
		setActiveCategory(category)
		onCategoryChange?.(category)
	}

	return (
		<div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-[#121212]/95 dark:supports-[backdrop-filter]:bg-[#121212]/80">
			<div className="mx-auto flex w-full max-w-[1600px] gap-2 overflow-x-auto px-3 py-3 scrollbar-hide xxs:px-4 sm:gap-3 sm:px-5">
				{CATEGORIES.map((category) => (
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
