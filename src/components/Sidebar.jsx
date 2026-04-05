import { useContext } from "react"
import { HiOutlineHome } from "react-icons/hi2"
import { MdOutlineSubscriptions } from "react-icons/md"
import { MdOutlineVideoLibrary } from "react-icons/md"
import { MdOutlineHistory } from "react-icons/md"
import { UIContext } from "../context/UIContext"

const navItems = [
	{ name: "Home", icon: HiOutlineHome, href: "/" },
	{
		name: "Subscriptions",
		icon: MdOutlineSubscriptions,
		href: "/subscriptions",
	},
	{ name: "Library", icon: MdOutlineVideoLibrary, href: "/library" },
	{ name: "History", icon: MdOutlineHistory, href: "/history" },
]

export default function Sidebar() {
	const { sidebarOpen } = useContext(UIContext)

	return (
		<aside
			className={`fixed left-0 top-12 h-[calc(100vh-48px)] bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-y-auto ${
				sidebarOpen ? "w-56" : "w-0"
			}`}
		>
			<nav className="p-2 flex flex-col gap-1">
				{navItems.map((item) => {
					const Icon = item.icon
					return (
						<a
							key={item.name}
							href={item.href}
							className="flex items-center gap-6 px-3 py-3 rounded-lg hover:bg-gray-150 transition text-gray-900 text-sm font-normal"
						>
							<Icon size={22} />
							<span>{item.name}</span>
						</a>
					)
				})}
			</nav>

			<hr className="my-3" />

			<div className="px-3 py-2 text-xs text-gray-600 space-y-2">
				<p className="text-gray-500 leading-relaxed font-light">
					About Press Copyright Contact us Creators Advertise Developers
				</p>
				<p className="text-gray-500 leading-relaxed font-light">
					Terms Privacy Policy & Safety How YouTube works Test new features
				</p>
			</div>
		</aside>
	)
}
