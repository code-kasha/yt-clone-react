import axios from "axios"
import { useContext, useEffect, useMemo, useState } from "react"
import { BiDislike, BiLike } from "react-icons/bi"
import { BiShare } from "react-icons/bi"
import { BiBookmark } from "react-icons/bi"
import { Link, useNavigate, useParams } from "react-router-dom"
import CommentSection from "../components/CommentSection"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import {
	FALLBACK_AVATAR,
	FALLBACK_THUMBNAIL,
	normalizeVideo,
} from "../api/videos"
import { AuthContext } from "../context/AuthContext"
import { UIContext } from "../context/UIContext"

const getEmbedUrl = (videoUrl) => {
	if (!videoUrl) return ""

	const embedParams = new URLSearchParams({
		autoplay: "0",
		controls: "1",
		modestbranding: "1",
		rel: "0",
		playsinline: "1",
		iv_load_policy: "3",
	})

	try {
		const url = new URL(videoUrl)
		const directVideoId = url.searchParams.get("v")
		if (directVideoId) {
			return `https://www.youtube.com/embed/${directVideoId}?${embedParams.toString()}`
		}

		if (url.hostname.includes("youtu.be")) {
			const shortId = url.pathname.replace("/", "")
			return shortId
				? `https://www.youtube.com/embed/${shortId}?${embedParams.toString()}`
				: ""
		}

		return videoUrl
	} catch {
		return videoUrl
	}
}

const normalizeComments = (comments = []) =>
	comments.map((comment) => ({
		id: comment._id,
		text: comment.text,
		timestamp: comment.timestamp || comment.createdAt,
		user: {
			_id: comment.userId?._id || "",
			username: comment.userId?.username || "Anonymous",
			avatar: comment.userId?.avatar || "",
		},
	}))

export default function VideoPlayer() {
	const navigate = useNavigate()
	const { id } = useParams()
	const { sidebarOpen } = useContext(UIContext)
	const { user, isAuthenticated } = useContext(AuthContext)
	const [video, setVideo] = useState(null)
	const [comments, setComments] = useState([])
	const [recommendedVideos, setRecommendedVideos] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [actionLoading, setActionLoading] = useState("")
	const [commentError, setCommentError] = useState("")
	const [commentBusyId, setCommentBusyId] = useState("")

	useEffect(() => {
		setLoading(true)
		setError("")

		axios
			.get(`http://localhost:5000/api/videos/${id}`)
			.then(({ data }) => {
				const normalizedVideo = normalizeVideo(data?.video || {})
				setVideo(normalizedVideo)
			})
			.catch((fetchError) => {
				console.error("Failed to load video", fetchError)
				setError(
					fetchError.response?.data?.message ||
						"Could not load this video right now.",
				)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [id])

	useEffect(() => {
		setCommentError("")
		axios
			.get(`http://localhost:5000/api/comments/${id}`)
			.then(({ data }) => {
				setComments(normalizeComments(data?.comments || []))
			})
			.catch((fetchError) => {
				console.error("Failed to load comments", fetchError)
				setCommentError(
					fetchError.response?.data?.message ||
						"Could not load comments right now.",
				)
			})
	}, [id])

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/videos", {
				params: {
					page: 1,
					limit: 20,
				},
			})
			.then(({ data }) => {
				const videos = Array.isArray(data?.videos)
					? data.videos.map(normalizeVideo)
					: []
				setRecommendedVideos(
					videos.filter((item) => item.id !== id).slice(0, 12),
				)
			})
			.catch((fetchError) => {
				console.error("Failed to load recommendations", fetchError)
				setRecommendedVideos([])
			})
	}, [id])

	useEffect(() => {
		if (!video?.title) return

		const previousTitle = document.title
		document.title = `${video.title} - YouTube`

		return () => {
			document.title = previousTitle
		}
	}, [video?.title])

	const liked = useMemo(() => {
		if (!user?.id || !video) return false
		return video.likedBy?.includes(user.id)
	}, [user?.id, video])

	const disliked = useMemo(() => {
		if (!user?.id || !video) return false
		return video.dislikedBy?.includes(user.id)
	}, [user?.id, video])

	const handleReaction = async (type) => {
		if (!isAuthenticated) {
			navigate("/login")
			return
		}

		setActionLoading(type)
		try {
			const { data } = await axios.put(
				`http://localhost:5000/api/videos/${id}/${type}`,
			)

			setVideo((previousVideo) => ({
				...previousVideo,
				likes: data?.video?.likes ?? previousVideo.likes,
				dislikes: data?.video?.dislikes ?? previousVideo.dislikes,
				likedBy: Array.isArray(data?.video?.likedBy)
					? data.video.likedBy
					: previousVideo.likedBy,
				dislikedBy: Array.isArray(data?.video?.dislikedBy)
					? data.video.dislikedBy
					: previousVideo.dislikedBy,
			}))
		} catch (reactionError) {
			console.error(`Failed to ${type} video`, reactionError)
		} finally {
			setActionLoading("")
		}
	}

	const handleAddComment = async (text) => {
		if (!isAuthenticated) {
			navigate("/login")
			return
		}

		setCommentBusyId("new")
		setCommentError("")

		try {
			const { data } = await axios.post(`http://localhost:5000/api/comments/${id}`, {
				text,
			})

			const newComment = normalizeComments([data?.comment]).at(0)
			if (newComment) {
				setComments((previousComments) => [newComment, ...previousComments])
			}
		} catch (commentAddError) {
			console.error("Failed to add comment", commentAddError)
			setCommentError(
				commentAddError.response?.data?.message ||
					"Could not add comment right now.",
			)
		} finally {
			setCommentBusyId("")
		}
	}

	const handleEditComment = async (commentToEdit, text) => {
		setCommentBusyId(commentToEdit.id)
		setCommentError("")

		try {
			const { data } = await axios.put(
				`http://localhost:5000/api/comments/${commentToEdit.id}`,
				{ text },
			)

			const updatedComment = normalizeComments([data?.comment]).at(0)
			if (updatedComment) {
				setComments((previousComments) =>
					previousComments.map((comment) =>
						comment.id === commentToEdit.id ? updatedComment : comment,
					),
				)
			}
		} catch (commentEditError) {
			console.error("Failed to edit comment", commentEditError)
			setCommentError(
				commentEditError.response?.data?.message ||
					"Could not update comment right now.",
			)
		} finally {
			setCommentBusyId("")
		}
	}

	const handleDeleteComment = async (commentToDelete) => {
		const confirmed = window.confirm(
			"Delete this comment? This action cannot be undone.",
		)
		if (!confirmed) return

		setCommentBusyId(commentToDelete.id)
		setCommentError("")

		try {
			await axios.delete(`http://localhost:5000/api/comments/${commentToDelete.id}`)
			setComments((previousComments) =>
				previousComments.filter((comment) => comment.id !== commentToDelete.id),
			)
		} catch (commentDeleteError) {
			console.error("Failed to delete comment", commentDeleteError)
			setCommentError(
				commentDeleteError.response?.data?.message ||
					"Could not delete comment right now.",
			)
		} finally {
			setCommentBusyId("")
		}
	}

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
					{loading ? (
						<div className="mx-auto w-full max-w-275 px-3 py-6 xxs:px-4 sm:px-5">
							<div className="animate-pulse space-y-4">
								<div className="aspect-video rounded-2xl bg-gray-300 dark:bg-[#272727]" />
								<div className="h-8 w-2/3 rounded bg-gray-300 dark:bg-[#272727]" />
								<div className="h-5 w-1/3 rounded bg-gray-300 dark:bg-[#272727]" />
							</div>
						</div>
					) : error ? (
						<div className="mx-auto flex w-full max-w-275 items-center justify-center px-3 py-16 xxs:px-4 sm:px-5">
							<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					) : video ? (
						<>
							<div className="mx-auto w-full max-w-400 px-3 py-4 xxs:px-4 sm:px-5">
								<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
									<div className="min-w-0">
										<div className="overflow-hidden rounded-2xl bg-black shadow-sm">
											<iframe
												title={video.title}
												src={getEmbedUrl(video.videoUrl)}
												className="aspect-video w-full"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
											/>
										</div>

										<div className="mt-3 space-y-3">
											<h1 className="text-xl font-bold leading-8 text-gray-900 dark:text-gray-100 sm:text-2xl">
												{video.title}
											</h1>

											<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
												<div className="flex items-center gap-3">
													<div className="h-12 w-12 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
														<img
															src={video.avatar || FALLBACK_AVATAR}
															alt={video.channel}
															className="h-full w-full object-cover"
														/>
													</div>
													<div className="min-w-0">
														<Link
															to={`/channel/${video.channelId}`}
															className="block truncate text-base font-semibold text-gray-900 hover:underline dark:text-gray-100"
														>
															{video.channel}
														</Link>
														<p className="text-sm text-gray-500 dark:text-gray-400">
															{video.views} views •{" "}
															{video.publishedAt
																? new Date(
																		video.publishedAt,
																	).toLocaleDateString()
																: "Recently uploaded"}
														</p>
													</div>
													<button
														type="button"
														className="ml-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-[#121212] dark:hover:bg-gray-200"
													>
														Subscribe
													</button>
												</div>

												<div className="flex flex-wrap gap-3">
													<button
														type="button"
														onClick={() => handleReaction("like")}
														disabled={actionLoading === "like"}
														className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
															liked
																? "bg-blue-600 text-white hover:bg-blue-500"
																: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-[#272727] dark:text-gray-100 dark:hover:bg-[#333]"
														}`}
													>
														<BiLike size={18} />
														<span>{video.likes}</span>
													</button>
													<button
														type="button"
														onClick={() => handleReaction("dislike")}
														disabled={actionLoading === "dislike"}
														className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
															disliked
																? "bg-red-600 text-white hover:bg-red-500"
																: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-[#272727] dark:text-gray-100 dark:hover:bg-[#333]"
														}`}
													>
														<BiDislike size={18} />
														<span>{video.dislikes}</span>
													</button>
													<button
														type="button"
														className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-300 dark:bg-[#272727] dark:text-gray-100 dark:hover:bg-[#333]"
													>
														<BiShare size={18} />
														<span>Share</span>
													</button>
													<button
														type="button"
														className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-300 dark:bg-[#272727] dark:text-gray-100 dark:hover:bg-[#333]"
													>
														<BiBookmark size={18} />
														<span>Save</span>
													</button>
												</div>
											</div>

											<div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-[#181818]">
												<p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
													{video.description || "No description provided."}
												</p>
											</div>
										</div>

										<CommentSection
											comments={comments}
											currentUser={user}
											isAuthenticated={isAuthenticated}
											onAddComment={handleAddComment}
											onEditComment={handleEditComment}
											onDeleteComment={handleDeleteComment}
											error={commentError}
											busy={commentBusyId === "new"}
											busyCommentId={commentBusyId}
										/>
									</div>

									<div className="space-y-3 xl:sticky xl:top-20">
										<div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-[#181818]">
											<h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
												Up next
											</h2>
											<div className="mt-3 space-y-3">
												{recommendedVideos.map((item) => (
													<Link
														key={item.id}
														to={`/video/${item.routeId || item.id}`}
														className="group flex gap-3"
													>
														<div className="relative w-42 shrink-0 overflow-hidden rounded-xl bg-gray-300 dark:bg-[#272727]">
															<img
																src={item.thumbnail || FALLBACK_THUMBNAIL}
																alt={item.title}
																onError={(event) => {
																	event.currentTarget.src = FALLBACK_THUMBNAIL
																}}
																className="aspect-video h-full w-full object-cover"
															/>
														</div>
														<div className="min-w-0 pt-0.5">
															<h3 className="line-clamp-2 text-[0.92rem] font-medium leading-5 text-gray-900 transition group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-gray-300">
																{item.title}
															</h3>
															<p className="mt-1 text-xs leading-4 text-gray-600 dark:text-gray-400">
																{item.channel}
															</p>
															<p className="text-xs leading-4 text-gray-500 dark:text-gray-400">
																{item.views} views
															</p>
														</div>
													</Link>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</>
					) : null}
				</main>
			</div>
		</div>
	)
}
