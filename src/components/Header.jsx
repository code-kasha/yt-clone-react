import { useContext } from "react"
import { HiOutlineBars3 } from "react-icons/hi2"
import { IoSearchSharp } from "react-icons/io5"
import { FaYoutube } from "react-icons/fa"
import { UIContext } from "../context/UIContext"

export default function Header() {
	const { toggleSidebar } = useContext(UIContext)

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
			<div className="flex items-center justify-between px-4 py-2 gap-4">
				{/* Left Section - Hamburger & Logo */}
				<div className="flex items-center gap-3 min-w-fit">
					<button
						onClick={toggleSidebar}
						className="p-2 hover:bg-gray-100 rounded-full transition"
						aria-label="Toggle sidebar"
					>
						<HiOutlineBars3 size={24} className="text-black" />
					</button>
					<div className="flex items-center gap-1.5">
						<FaYoutube size={28} className="text-red-600" />
						<span className="font-bold text-lg hidden sm:inline text-black">
							YouTube
						</span>
					</div>
				</div>

				{/* Center Section - Search Bar */}
				<div className="flex-1 max-w-md px-2">
					<div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5">
						<input
							type="text"
							placeholder="Search"
							className="bg-transparent outline-none flex-1 text-sm text-black placeholder-gray-600"
						/>
						<button className="p-1.5 hover:bg-gray-200 rounded-full transition">
							<IoSearchSharp size={18} className="text-gray-600" />
						</button>
					</div>
				</div>

				{/* Right Section - Auth & Menu */}
				<div className="flex items-center gap-3 min-w-fit">
					<button className="px-5 py-1.5 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition text-sm">
						Sign In
					</button>
				</div>
			</div>
		</header>
	)
}
