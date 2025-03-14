import { Spotlight } from "@/components/ui/spotlight";
import InputBox from "@/components/InputBox";
import { SplineScene } from "@/components/ui/splite";
import { Analytics } from "@vercel/analytics/react"
export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col-reverse md:flex-row items-center justify-center bg-black text-white px-6 sm:px-8 md:px-16 py-12 gap-12">
      {/* Global Spotlight (Hidden on small screens) */}
      <Spotlight className="hidden sm:block absolute inset-0 w-full h-full bg-white/55 blur-2xl rounded-full pointer-events-none" />

      {/* Left Content */}
      <div className="text-center md:text-left max-w-2xl relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide font-mono">
          GitTrack
          <span className="block w-24 sm:w-28 md:w-32 h-1 bg-indigo-400 mt-3 mx-auto md:mx-0 rounded-full"></span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mt-4 sm:mt-6 text-gray-300 leading-snug">
          Generate an <span className="text-red-500 font-bold">AI-generated</span> summary of your GitHub activity, track contributions, and <span className="text-red-500 font-bold">compare with peers</span>.
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <InputBox />
        </div>
      </div>

      {/* Right Side - Spline Character (Hidden on Mobile) */}
      <div className="hidden md:flex w-full md:w-1/2 max-w-lg h-[400px] sm:h-[500px] items-center justify-center relative">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-gray-400 text-sm">
        Created by{" "}
        <a
          href="https://github.com/ramith-kulal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Ramith Kulal
        </a>
      </div>
      <Analytics/>
    </div>
  );
}
