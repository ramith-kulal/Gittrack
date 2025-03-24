"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/profile/${username}`);
    }
  };
 
  return (
    <div className="flex justify-center ">
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg flex">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-5 py-3 text-lg text-white bg-gray-800 border border-gray-700 rounded-l-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition"
        />
        <button
          type="submit"
          className="px-6 py-3 text-lg font-semibold text-white bg-red-600 rounded-r-xl shadow-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition flex items-center justify-center gap-2"
        >
          <FaGithub className="w-6 h-6" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
