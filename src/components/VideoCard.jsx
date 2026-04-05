import { Link } from "react-router-dom"

export default function VideoCard({ video }) {
	const formatViews = (views) => {
		if (views >= 1000000) return (views / 1000000).toFixed(1) + "M"
		if (views >= 1000) return (views / 1000).toFixed(1) + "K"
		return views
	}

	return (
		<Link to={`/video/${video.id}`} className="group cursor-pointer">
			{/* Thumbnail */}
			<div className="relative bg-gray-300 rounded-xl overflow-hidden h-40 mb-3 group-hover:rounded-none transition">
				<img
					src={
						video.thumbnail || "https://via.placeholder.com/320x180?text=Video"
					}
					alt={video.title}
					className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
				/>
				<span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
					12:34
				</span>
			</div>

			{/* Video Info */}
			<div className="flex gap-3 px-0">
				{/* Channel Avatar */}
				<div className="w-9 h-9 rounded-full bg-gray-400 flex-shrink-0 mt-1" />

				{/* Title, Channel, Stats */}
				<div className="flex-1 min-w-0">
					<h3 className="font-medium text-sm line-clamp-2 text-gray-900 group-hover:text-gray-700">
						{video.title}
					</h3>
					<p className="text-xs text-gray-600 mt-2 leading-tight">
						{video.channel}
					</p>
					<p className="text-xs text-gray-600 leading-tight">
						{formatViews(video.views || 0)} views • 2 days ago
					</p>
				</div>
			</div>
		</Link>
	)
}
