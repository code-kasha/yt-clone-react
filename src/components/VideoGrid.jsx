import VideoCard from "./VideoCard"

export default function VideoGrid({ videos, isLoading }) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-6">
				{[...Array(12)].map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="bg-gray-300 rounded-xl h-40 mb-3" />
						<div className="space-y-2 px-0">
							<div className="bg-gray-300 h-4 rounded" />
							<div className="bg-gray-300 h-3 rounded w-2/3" />
						</div>
					</div>
				))}
			</div>
		)
	}

	if (!videos || videos.length === 0) {
		return (
			<div className="flex items-center justify-center h-96">
				<p className="text-gray-500">No videos found</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-6">
			{videos.map((video) => (
				<VideoCard key={video.id} video={video} />
			))}
		</div>
	)
}
