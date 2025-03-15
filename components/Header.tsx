"use client";

import { useTheme } from "@/components/context/theme-context";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";

export default function Header() {
	const { theme, toggleTheme } = useTheme();
	const router = useRouter();

	return (
		<header className="h-16 flex justify-between items-center w-full p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-black">
			<h1 className="text-lg font-semibold text-black dark:text-white">
				🎬 Movie API
			</h1>

			<div className="flex gap-4">
				<button
					type="button"
					onClick={toggleTheme}
					className="p-2 rounded-md border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
				>
					{theme === "light" ? (
						<Moon size={20} />
					) : (
						<Sun size={20} className="text-white" />
					)}
				</button>
			</div>
		</header>
	);
}
