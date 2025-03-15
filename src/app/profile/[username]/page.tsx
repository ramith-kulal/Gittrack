"use client";
import Image from "next/image";
import Link from "next/link";
import { useUserProfile } from "../../query/data";
import { useParams } from "next/navigation";
import { FaSpinner, FaCode, FaStar, FaUsers, FaCalendarAlt, FaTrophy, FaCrown } from "react-icons/fa";
import { JSX } from "react";

export default function ProfilePage() {
  const params = useParams();
  const { username } = params || {};
  const { data: accountData, isLoading, error } = useUserProfile(username as string);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        <p className="mt-4 text-gray-400 italic text-sm">{getRandomRoast()}</p>
      </div>
    );   

    if (error)
      return (
        <div className="text-center mt-6">
          <p className="text-red-500 font-bold">Oops! No GitHub user found.</p>
          <p className="text-gray-500 text-sm">Did you enter the right username? 🤔</p>
          <img
            src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
            alt="GitHub Octocat"
            className="mx-auto mt-4 w-24 h-24"
          />
        </div>
      );
    
    if (!accountData || Object.keys(accountData).length === 0)
      return (
        <p className="text-gray-400 text-center mt-6">
          No profile data available. Maybe there hiding? 👀
        </p>
      );
    

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center space-y-6 relative">
      {/* Go Back Button - Hidden on small devices */}
      <Link
        href="/"
        className="hidden sm:flex absolute top-4 left-4 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg items-center gap-2"
      >
        ← Go Back
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full max-w-3xl text-center sm:text-left">
        {accountData.avatar ? (
          <Image
            src={accountData.avatar}
            alt={accountData.name || "User Avatar"}
            width={90}
            height={90}
            className="rounded-full border-2 border-indigo-500 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
            <FaUsers className="text-3xl text-gray-300" />
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold">{accountData.name || "Unknown User"}</h1>
          <p className="text-gray-400 text-lg">@{accountData.username || "N/A"}</p>
          <p className="text-gray-300 mt-1 italic">{accountData.bio || "No bio available"}</p>
        </div>
      </div>

      {/* Level & Tier */}
      <div className="flex flex-wrap justify-center gap-4 text-lg">
        <span className="px-4 py-1 bg-indigo-700 text-white rounded-full shadow-md flex items-center gap-2">
          <FaTrophy /> Level {accountData.level || "?"}
        </span>
        <span className="px-4 py-1 bg-purple-700 text-white rounded-full shadow-md flex items-center gap-2">
          <FaCrown /> {accountData.tier || "Unknown"}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl text-center">
        <Stat label="Issues Created" value={accountData.totalIssuesCreated || 0} icon={<FaCode />} />
        <Stat label="PRs Created" value={accountData.totalPRsCreated || 0} icon={<FaCode />} />
        <Stat label="Joined" value={`${accountData.accountAge || "?"} years ago`} icon={<FaCalendarAlt />} />
      </div>

      {/* GitHub Stats */}
      <div className="max-w-3xl w-full text-lg">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-400">GitHub Stats</h2>
        <p><FaCode className="inline-block mr-2 text-indigo-400" /> Total Repositories: <span className="font-bold">{accountData.totalRepos || 0}</span></p>
        <p><FaStar className="inline-block mr-2 text-yellow-400" /> Total Stars: <span className="font-bold">{accountData.totalStars || 0}</span></p>
        <p><FaCode className="inline-block mr-2 text-green-400" /> Top Languages: <span className="font-bold">{accountData.topLanguages?.join(", ") || "N/A"}</span></p>

        {accountData.firstPR && (
          <p className="text-sm text-gray-400 mt-2">
            <FaTrophy className="inline-block mr-2 text-yellow-500" /> First PR: 
            <a href={accountData.firstPR.url} target="_blank" className="text-blue-400 hover:underline">
              {accountData.firstPR.title}
            </a> ({new Date(accountData.firstPR.created_at).toLocaleDateString()})
          </p>
        )}
      </div>

      {/* Honest Review Section */}
      <div className="max-w-3xl w-full mt-6 text-lg leading-relaxed text-gray-300 border-l-4 border-indigo-500 pl-4">
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">🔥 Brutally Honest Profile Review</h2>
        <p className="italic">{accountData.summary || "No summary available, but let's be real... maybe that's for the best. 😆"}</p>
      </div>
    </div>
  );
}

// Stats Component
function Stat({ label, value, icon }: { label: string; value: string | number; icon: JSX.Element }) {
  return (
    <div className="text-center text-lg font-semibold">
      <p className="text-indigo-400 flex items-center justify-center gap-2">{icon} {label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

// Function to get a random roasting line
function getRandomRoast() {
  const roasts = [
    "Loading... just like your career after choosing MERN. 😆",
    "Patience, young grasshopper... unlike your code, this actually works. 🦗",
    "Hang tight! This loads faster than your PRs get approved. ⚡",
    "Relax... its not like you were productive anyway. 😴",
  ];
  return roasts[Math.floor(Math.random() * roasts.length)];
}
