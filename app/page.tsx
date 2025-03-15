"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className=" flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white px-6 transition-colors duration-300">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">Movie API 🎬</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            A simple, fast, and secure API for managing movies, users, and authentication.
          </p>
          <Link href="/docs">
            <button className="px-6 py-3 border border-black dark:border-white rounded-md text-lg font-medium transition hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer">
              View API Docs →
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
