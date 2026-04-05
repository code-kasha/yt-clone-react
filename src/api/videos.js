import axios from "axios"

const API_URL = "http://localhost:5000/api/videos"
export const PAGE_SIZE = 12
const FETCH_LIMIT = 200
export const FALLBACK_THUMBNAIL =
	"https://via.placeholder.com/320x180?text=Video"
export const FALLBACK_AVATAR =
	"https://via.placeholder.com/150?text=Avatar"

export const normalizeVideo = (video) => ({
	id: video.videoId || video._id,
	title: video.title,
	channel:
		video.channelId?.channelName ||
		video.uploader?.username ||
		"Unknown Channel",
	thumbnail: video.thumbnailUrl || FALLBACK_THUMBNAIL,
	views: video.views || 0,
	category: video.category || "Other",
	avatar: video.uploader?.avatar || FALLBACK_AVATAR,
	publishedAt: video.uploadDate || video.createdAt,
	videoUrl: video.videoUrl,
	description: video.description || "",
})

export const fetchVideos = () =>
	axios.get(API_URL, {
		params: {
			page: 1,
			limit: FETCH_LIMIT,
		},
	})
