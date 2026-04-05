import { useContext, useEffect, useMemo, useState } from "react"
import { HiOutlineMagnifyingGlass } from "react-icons/hi2"
import { useParams } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"
import ChannelVideoCard from "../components/ChannelVideoCard"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import VideoFormModal from "../components/VideoFormModal"
import { FALLBACK_AVATAR, normalizeVideo } from "../api/videos"
import { AuthContext } from "../context/AuthContext"
import { UIContext } from "../context/UIContext"

const CHANNEL_TABS = ["Home", "Videos", "Shorts", "Live", "Playlists", "Community"]
const SORT_OPTIONS = ["Latest", "Popular", "Oldest"]
const FALLBACK_CATEGORIES = [
	"Music",
	"Gaming",
	"Education",
	"Entertainment",
	"Sports",
	"Tech",
	"Other",
]
const EMPTY_FORM = {
	title: "",
	description: "",
	videoUrl: "",
	thumbnailUrl: "",
	category: FALLBACK_CATEGORIES[0],
}
const DESCRIPTION_PREVIEW_LENGTH = 180

const normalizeChannel = (channel) => ({
	id: channel?._id || channel?.channelId || "",
	channelId: channel?.channelId || channel?._id || "",
	channelName: channel?.channelName || "Untitled Channel",
	description: channel?.description || "No description provided.",
	channelBanner:
		channel?.channelBanner ||
		"https://via.placeholder.com/1280x320?text=Channel+Banner",
	subscribers: Array.isArray(channel?.subscribers)
		? channel.subscribers.length
		: Number(channel?.subscriberCount ?? channel?.subscribers ?? 0),
	owner: {
		id: channel?.owner?._id || "",
		username: channel?.owner?.username || channel?.channelName || "Channel Owner",
		avatar: channel?.owner?.avatar || FALLBACK_AVATAR,
	},
	videos: Array.isArray(channel?.videos)
		? channel.videos.map(normalizeVideo)
		: [],
})

const formatSubscribers = (count) => {
	if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M subscribers`
	if (count >= 1000) return `${(count / 1000).toFixed(1)}K subscribers`
	return `${count} subscribers`
}

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

	return normalizedCategories.length > 0
		? [...new Set(normalizedCategories)]
		: FALLBACK_CATEGORIES
}

const validateVideoForm = (formData, mode) => {
	const errors = {}

	if (!formData.title.trim()) {
		errors.title = "Title is required."
	} else if (formData.title.trim().length < 3) {
		errors.title = "Title must be at least 3 characters."
	}

	if (!formData.description.trim()) {
		errors.description = "Description is required."
	}

	if (mode === "create" && !formData.videoUrl.trim()) {
		errors.videoUrl = "Video URL is required."
	}

	if (!formData.category.trim()) {
		errors.category = "Category is required."
	}

	return errors
}

const renderDescriptionWithLinks = (text) => {
	const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
	const isUrl = /^(https?:\/\/[^\s]+|www\.[^\s]+)$/i
	const lines = text.split("\n")

	return lines.map((line, lineIndex) => {
		const parts = line.split(urlPattern)

		return (
			<span key={`line-${lineIndex}`} className="block">
				{parts.map((part, partIndex) => {
					if (!part) return null

					if (isUrl.test(part)) {
						const href = part.startsWith("http") ? part : `https://${part}`

						return (
							<a
								key={`part-${lineIndex}-${partIndex}`}
								href={href}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
							>
								{part}
							</a>
						)
					}
					return <span key={`part-${lineIndex}-${partIndex}`}>{part}</span>
				})}
			</span>
		)
	})
}

export default function ChannelPage() {
	const { id } = useParams()
	const { sidebarOpen } = useContext(UIContext)
	const { user, isAuthenticated } = useContext(AuthContext)
	const [channel, setChannel] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [selectedSort, setSelectedSort] = useState("Latest")
	const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
	const [modalOpen, setModalOpen] = useState(false)
	const [formMode, setFormMode] = useState("create")
	const [formData, setFormData] = useState(EMPTY_FORM)
	const [formErrors, setFormErrors] = useState({})
	const [submitError, setSubmitError] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [editingVideoId, setEditingVideoId] = useState("")
	const [deletingVideoId, setDeletingVideoId] = useState("")
	const [showFullDescription, setShowFullDescription] = useState(false)

	useEffect(() => {
		setLoading(true)
		setError("")

		axiosInstance
			.get(`/channels/${id}`)
			.then(({ data }) => {
				setChannel(normalizeChannel(data?.channel || {}))
			})
			.catch((fetchError) => {
				console.error("Failed to load channel", fetchError)
				setError(
					fetchError.response?.data?.message ||
						"Could not load this channel right now.",
				)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [id])

	useEffect(() => {
		axiosInstance
			.get("/categories")
			.then(({ data }) => {
				setCategories(normalizeCategories(data))
			})
			.catch(() => {
				setCategories(FALLBACK_CATEGORIES)
			})
	}, [])

	useEffect(() => {
		if (!channel?.channelName) return

		const previousTitle = document.title
		document.title = `${channel.channelName} - YouTube`

		return () => {
			document.title = previousTitle
		}
	}, [channel?.channelName])

	useEffect(() => {
		setShowFullDescription(false)
	}, [channel?.id])

	const sortedVideos = useMemo(() => {
		if (!channel?.videos) return []

		const videos = [...channel.videos]

		if (selectedSort === "Popular") {
			return videos.sort((a, b) => (b.views || 0) - (a.views || 0))
		}

		if (selectedSort === "Oldest") {
			return videos.sort(
				(a, b) =>
					new Date(a.publishedAt || 0).getTime() -
					new Date(b.publishedAt || 0).getTime(),
			)
		}

		return videos.sort(
			(a, b) =>
				new Date(b.publishedAt || 0).getTime() -
				new Date(a.publishedAt || 0).getTime(),
		)
	}, [channel?.videos, selectedSort])

	const isOwner =
		Boolean(isAuthenticated && user?.id && channel?.owner?.id) &&
		String(user.id) === String(channel.owner.id)
	const fullDescription = channel?.description || ""
	const shouldClampDescription =
		fullDescription.length > DESCRIPTION_PREVIEW_LENGTH ||
		fullDescription.split("\n").length > 3
	const visibleDescription =
		shouldClampDescription && !showFullDescription
			? `${fullDescription.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
			: fullDescription

	const resetFormState = () => {
		setFormData({
			...EMPTY_FORM,
			category: categories[0] || FALLBACK_CATEGORIES[0],
		})
		setFormErrors({})
		setSubmitError("")
		setEditingVideoId("")
	}

	const openCreateModal = () => {
		setFormMode("create")
		resetFormState()
		setModalOpen(true)
	}

	const openEditModal = (video) => {
		setFormMode("edit")
		setEditingVideoId(video.id)
		setFormErrors({})
		setSubmitError("")
		setFormData({
			title: video.title || "",
			description: video.description || "",
			videoUrl: video.videoUrl || "",
			thumbnailUrl: video.thumbnail || "",
			category: video.category || categories[0] || FALLBACK_CATEGORIES[0],
		})
		setModalOpen(true)
	}

	const closeModal = () => {
		if (submitting) return
		setModalOpen(false)
		resetFormState()
	}

	const updateFormField = (field, value) => {
		setFormData((current) => ({
			...current,
			[field]: value,
		}))
		setFormErrors((current) => {
			if (!current[field]) return current
			return {
				...current,
				[field]: "",
			}
		})
		setSubmitError("")
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const errors = validateVideoForm(formData, formMode)
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors)
			return
		}

		setSubmitting(true)
		setSubmitError("")

		const payload = {
			title: formData.title.trim(),
			description: formData.description.trim(),
			videoUrl: formData.videoUrl.trim(),
			thumbnailUrl: formData.thumbnailUrl.trim(),
			category: formData.category.trim(),
			channelId: channel.channelId || channel.id,
		}

		try {
			if (formMode === "create") {
				const { data } = await axiosInstance.post("/videos", payload)
				const nextVideo = normalizeVideo(data?.video || {})

				setChannel((current) => ({
					...current,
					videos: [nextVideo, ...(current?.videos || [])],
				}))
			} else {
				const { data } = await axiosInstance.put(
					`/videos/${editingVideoId}`,
					{
						title: payload.title,
						description: payload.description,
						category: payload.category,
						thumbnailUrl: payload.thumbnailUrl,
					},
				)
				const nextVideo = normalizeVideo(data?.video || {})

				setChannel((current) => ({
					...current,
					videos: (current?.videos || []).map((video) =>
						video.id === nextVideo.id ? nextVideo : video,
					),
				}))
			}

			setModalOpen(false)
			resetFormState()
		} catch (requestError) {
			const apiErrors = requestError.response?.data?.errors
			if (apiErrors && typeof apiErrors === "object") {
				setFormErrors((current) => ({
					...current,
					...apiErrors,
				}))
			}

			setSubmitError(
				requestError.response?.data?.message ||
					"Could not save the video right now.",
			)
		} finally {
			setSubmitting(false)
		}
	}

	const handleDelete = async (video) => {
		const confirmed = window.confirm(
			`Delete "${video.title}"? This action cannot be undone.`,
		)
		if (!confirmed) return

		setDeletingVideoId(video.id)

		try {
			await axiosInstance.delete(`/videos/${video.id}`)

			setChannel((current) => ({
				...current,
				videos: (current?.videos || []).filter((item) => item.id !== video.id),
			}))
		} catch (requestError) {
			setSubmitError(
				requestError.response?.data?.message ||
					"Could not delete the video right now.",
			)
		} finally {
			setDeletingVideoId("")
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
						<div className="mx-auto w-full max-w-[1600px] px-3 py-6 xxs:px-4 sm:px-5">
							<div className="animate-pulse space-y-5">
								<div className="h-44 rounded-2xl bg-gray-300 dark:bg-[#272727]" />
								<div className="flex items-center gap-4">
									<div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-[#272727]" />
									<div className="space-y-3">
										<div className="h-7 w-48 rounded bg-gray-300 dark:bg-[#272727]" />
										<div className="h-4 w-32 rounded bg-gray-300 dark:bg-[#272727]" />
									</div>
								</div>
							</div>
						</div>
					) : error ? (
						<div className="mx-auto flex w-full max-w-[1200px] items-center justify-center px-3 py-16 xxs:px-4 sm:px-5">
							<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					) : channel ? (
						<div className="mx-auto w-full max-w-[1600px] px-3 py-5 xxs:px-4 sm:px-5">
							<div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-[#1c1c1c]">
								<img
									src={channel.channelBanner}
									alt={channel.channelName}
									onError={(event) => {
										event.currentTarget.src =
											"https://via.placeholder.com/1280x320?text=Channel+Banner"
									}}
									className="h-32 w-full object-cover xxs:h-40 sm:h-52 lg:h-60"
								/>
							</div>

							<section className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex min-w-0 items-start gap-4">
									<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-500 text-3xl font-semibold text-white dark:bg-sky-600 sm:h-24 sm:w-24">
										<img
											src={channel.owner.avatar || FALLBACK_AVATAR}
											alt={channel.channelName}
											onError={(event) => {
												event.currentTarget.src = FALLBACK_AVATAR
											}}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="min-w-0">
										<h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
											{channel.channelName}
										</h1>
										<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
											<span>@{channel.owner.username}</span>
											<span>•</span>
											<span>{formatSubscribers(channel.subscribers)}</span>
											<span>•</span>
											<span>{channel.videos.length} videos</span>
										</div>
										<div className="mt-3 max-w-3xl">
											<div className="text-sm leading-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
												{renderDescriptionWithLinks(visibleDescription)}
											</div>
											{shouldClampDescription ? (
												<button
													type="button"
													onClick={() =>
														setShowFullDescription((current) => !current)
													}
													className="mt-2 text-sm font-medium text-gray-900 hover:underline dark:text-gray-100"
												>
													{showFullDescription ? "Read less" : "Read more"}
												</button>
											) : null}
										</div>
										{submitError && !modalOpen ? (
											<p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
												{submitError}
											</p>
										) : null}
									</div>
								</div>

								<div className="flex shrink-0 items-center gap-3">
									{isOwner ? (
										<button
											type="button"
											onClick={openCreateModal}
											className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
										>
											Upload Video
										</button>
									) : null}
									<button
										type="button"
										className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-[#121212] dark:hover:bg-gray-200"
									>
										Subscribe
									</button>
								</div>
							</section>

							<div className="mt-6 border-b border-gray-200 dark:border-gray-800">
								<div className="scrollbar-hide flex items-center gap-5 overflow-x-auto text-sm font-medium text-gray-600 dark:text-gray-400">
									{CHANNEL_TABS.map((tab) => (
										<button
											key={tab}
											type="button"
											className={`border-b-2 px-1 py-3 whitespace-nowrap transition ${
												tab === "Videos"
													? "border-black text-black dark:border-white dark:text-white"
													: "border-transparent hover:text-black dark:hover:text-white"
											}`}
										>
											{tab}
										</button>
									))}
									<button
										type="button"
										className="ml-auto hidden rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white sm:inline-flex"
										aria-label="Search channel"
									>
										<HiOutlineMagnifyingGlass size={18} />
									</button>
								</div>
							</div>

							<div className="mt-4 flex flex-wrap items-center gap-2">
								{SORT_OPTIONS.map((option) => (
									<button
										key={option}
										type="button"
										onClick={() => setSelectedSort(option)}
										className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
											selectedSort === option
												? "bg-black text-white dark:bg-white dark:text-[#121212]"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#272727] dark:text-gray-200 dark:hover:bg-[#333333]"
										}`}
									>
										{option}
									</button>
								))}
							</div>

							<div className="mt-4">
								{sortedVideos.length > 0 ? (
									<div className="grid grid-cols-1 gap-x-4 gap-y-8 pb-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
										{sortedVideos.map((video) => (
											<ChannelVideoCard
												key={video.id}
												video={video}
												canManage={isOwner}
												onEdit={openEditModal}
												onDelete={handleDelete}
												isDeleting={deletingVideoId === video.id}
											/>
										))}
									</div>
								) : (
									<div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-[#181818]">
										<p className="text-sm text-gray-500 dark:text-gray-400">
											This channel has not uploaded any videos yet.
										</p>
									</div>
								)}
							</div>
						</div>
					) : null}
				</main>
			</div>

			<VideoFormModal
				open={modalOpen}
				mode={formMode}
				formData={formData}
				formErrors={formErrors}
				submitError={submitError}
				submitting={submitting}
				categories={categories}
				onChange={updateFormField}
				onClose={closeModal}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}
