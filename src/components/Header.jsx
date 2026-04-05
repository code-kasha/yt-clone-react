import { useContext, useEffect, useRef, useState } from "react"
import { HiOutlineBars3 } from "react-icons/hi2"
import { HiOutlineArrowLeft } from "react-icons/hi2"
import { HiOutlineMoon } from "react-icons/hi2"
import { HiOutlineSun } from "react-icons/hi2"
import { IoSearchSharp } from "react-icons/io5"
import { FaYoutube } from "react-icons/fa"
import { UIContext } from "../context/UIContext"

export default function Header() {
	const { toggleSidebar, darkMode, toggleTheme } = useContext(UIContext)
	const [searchQuery, setSearchQuery] = useState("")
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
	const inputRef = useRef(null)

	useEffect(() => {
		if (mobileSearchOpen) {
			inputRef.current?.focus()
		}
	}, [mobileSearchOpen])

	const handleSubmit = (event) => {
		event.preventDefault()
		setMobileSearchOpen(false)
	}

	return (
		<header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#0f0f0f]">
			<div className="mx-auto flex w-full max-w-[1600px] items-center gap-2 px-3 py-2 xxs:px-4 sm:gap-4 sm:px-5">
				<div
					className={`flex min-w-fit items-center gap-2 xxs:gap-3 ${
						mobileSearchOpen ? "hidden" : "flex"
					} sm:flex`}
				>
					<button
						onClick={toggleSidebar}
						className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
						aria-label="Toggle sidebar"
					>
						<HiOutlineBars3 size={24} className="text-black dark:text-white" />
					</button>
					<div className="flex items-center gap-1.5">
						<FaYoutube size={28} className="text-red-600" />
						<span className="hidden text-lg font-bold text-black dark:text-white xxs:inline">
							YouTube
						</span>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className={`min-w-0 flex-1 justify-center ${
						mobileSearchOpen ? "flex" : "hidden"
					} sm:flex`}
				>
					<div className="flex w-full items-center gap-2 sm:mx-auto sm:max-w-xl sm:justify-center sm:px-4">
						<button
							type="button"
							onClick={() => setMobileSearchOpen(false)}
							className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
							aria-label="Close search"
						>
							<HiOutlineArrowLeft
								size={22}
								className="text-black dark:text-white"
							/>
						</button>
						<div className="flex w-full items-center rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-4 pr-2 shadow-sm focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-700 dark:bg-[#1f1f1f] dark:focus-within:border-blue-400 dark:focus-within:bg-[#181818] dark:focus-within:ring-blue-950">
							<input
								ref={inputRef}
								type="text"
								placeholder="Search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
							/>
							<button
								type="submit"
								className="rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
								aria-label="Search videos"
							>
								<IoSearchSharp
									size={18}
									className="text-gray-600 dark:text-gray-300"
								/>
							</button>
						</div>
					</div>
				</form>

				<div
					className={`ml-auto min-w-fit items-center gap-1 xxs:gap-2 ${
						mobileSearchOpen ? "hidden" : "flex"
					}`}
				>
					<button
						type="button"
						onClick={() => setMobileSearchOpen(true)}
						className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
						aria-label="Open search"
					>
						<IoSearchSharp size={20} className="text-gray-700 dark:text-gray-200" />
					</button>
					<button
						type="button"
						onClick={toggleTheme}
						className="rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
						aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
					>
						{darkMode ? (
							<HiOutlineSun size={20} className="text-amber-400" />
						) : (
							<HiOutlineMoon size={20} className="text-gray-700" />
						)}
					</button>
					<button className="rounded-full px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 xxs:px-4 sm:px-5">
						Sign In
					</button>
				</div>
			</div>
		</header>
	)
}
