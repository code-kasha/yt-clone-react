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
		<div className="sticky top-0 bg-white border-b border-gray-200 z-30">
			<div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
				{CATEGORIES.map((category) => (
					<button
						key={category}
						onClick={() => handleCategoryClick(category)}
						className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
							activeCategory === category
								? "bg-gray-900 text-white"
								: "bg-gray-200 text-gray-900 hover:bg-gray-300"
						}`}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	)
}
