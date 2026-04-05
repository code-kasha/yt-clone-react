import { useMemo, useState } from "react"
import CommentCard from "./CommentCard"
import { FALLBACK_AVATAR } from "../api/videos"

export default function CommentSection({
	comments = [],
	currentUser = null,
	isAuthenticated = false,
	onAddComment,
	onEditComment,
	onDeleteComment,
	error = "",
	busy = false,
	busyCommentId = "",
}) {
	const [draftComment, setDraftComment] = useState("")

	const commentCountLabel = useMemo(() => {
		const totalComments = comments.length
		return `${totalComments} Comment${totalComments === 1 ? "" : "s"}`
	}, [comments])

	const handleAddComment = () => {
		const trimmedComment = draftComment.trim()
		if (!trimmedComment) return

		onAddComment?.(trimmedComment)
	}

	return (
		<section className="w-full max-w-[960px] py-5">
			<div className="mb-4">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{commentCountLabel}
				</h2>
			</div>

			<div className="mb-6 flex gap-3">
				<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
					<img
						src={currentUser?.avatar || FALLBACK_AVATAR}
						alt={currentUser?.username || "Current user avatar"}
						onError={(event) => {
							event.currentTarget.src = FALLBACK_AVATAR
						}}
						className="h-full w-full object-cover"
					/>
				</div>

				<div className="min-w-0 flex-1 space-y-3">
					<textarea
						value={draftComment}
						onChange={(event) => setDraftComment(event.target.value)}
						rows={2}
						placeholder={
							isAuthenticated ? "Add a comment..." : "Sign in to add a comment..."
						}
						disabled={!isAuthenticated || busy}
						className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-0 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
					/>
					{error ? (
						<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
					) : null}
					<div className="flex justify-end">
						<button
							type="button"
							onClick={handleAddComment}
							disabled={!isAuthenticated || !draftComment.trim() || busy}
							className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
						>
							{busy ? "Saving..." : "Add comment"}
						</button>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				{comments.length > 0 ? (
					comments.map((comment) => (
						<CommentCard
							key={comment.id || comment._id}
							comment={comment}
							canManage={
								(currentUser?.id || currentUser?._id) === comment?.user?._id
							}
							onEdit={onEditComment}
							onDelete={onDeleteComment}
							busy={busyCommentId === comment.id}
						/>
					))
				) : (
					<div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-[#181818] dark:text-gray-400">
						No comments yet. Start the conversation.
					</div>
				)}
			</div>
		</section>
	)
}
