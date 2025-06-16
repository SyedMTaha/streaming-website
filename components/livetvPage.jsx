"use client"
import { useState } from "react"
import Image from "next/image"
import { Play, Pause, Volume2, Maximize, Settings, Star } from "lucide-react"
import home04 from './../public/assets/images/landing/home04.png';
import movie02 from './../public/assets/images/movies/sleepingangel.png';
import launch from './../public/assets/images/movies/launching-soon.gif';
import channel1 from './../public/assets/images/channels/channel01.png';
import channel2 from './../public/assets/images/channels/channel02.png';
import channel3 from './../public/assets/images/channels/channel03.png';
import channel4 from './../public/assets/images/channels/channel04.png';
import channel5 from './../public/assets/images/channels/channel05.png';


export default function LiveTVPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(45)
  const [duration, setDuration] = useState(120)

  const currentShow = {
    title: "Sleeping Angel",
    rating: "N/A",
    views: "N/A",
    reviews: "N/A",
    year: "N/A",
    duration: "N/A",
    contentRating: "N/A",
    genres: ["Action", "Crime", "Thriller"],
    description:
      "N/A",
    cast: ["N/A"],
    crew: ["N/A"],
    poster: "/placeholder.svg?height=400&width=300",
  }

  const channels = [
    { id: 1, name: "SCREAM BOX", logo: "/assets/images/channels/channel01.png", isActive: false },
    { id: 2, name: "CRIME HUNTERS", logo:"/assets/images/channels/channel05.png"  , isActive: false },
    { id: 3, name: "THRILLER TV", logo: "/assets/images/channels/channel04.png", isActive: true },
    { id: 4, name: "ACTION ZONE", logo: "/assets/images/channels/channel03.png", isActive: false },
    { id: 5, name: "MYSTERY CHANNEL", logo: "/assets/images/channels/channel02.png", isActive: false },
  ]

  const schedule = [
    { time: "14:00", title: "Tomorrow" },
    { time: "15:00", title: "Tomorrow" },
    { time: "16:00", title: "Tomorrow" },
    { time: "17:00", title: "Tomorrow" },
    { time: "18:00", title: "Tomorrow" },
    { time: "19:00", title: "Tomorrow" },
    { time: "20:00", title: "Tomorrow" },
    { time: "21:00", title: "Tomorrow" },
  ]

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020b1f] via-[#0a2151] to-[#020b1f] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <h1 className="text-2xl font-bold mb-6 ">Live Streaming</h1>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-video">
              <Image src={launch} alt="Live Stream" fill className="object-cover" />
              {/* Dissolving Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#020b1f] via-transparent to-[#020b1f] opacity-90" />
            </div>
          </div>
        </div>

        {/* Schedule and Channel Guide */}
        <div className="mt-8">
          <div className="bg-[#191C33] rounded-lg p-6">
            {/* Schedule Timeline */}
            <div className="mb-6">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4 border-b border-gray-600 pb-4">
                {schedule.map((slot, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{slot.title}</div>
                    <div className="text-sm font-medium text-white">{slot.time}</div>
                    {index < schedule.length - 1 && (
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-600 hidden md:block"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Channel List */}
            <div className="space-y-4">
              {channels.map((channel, index) => (
                <div key={channel.id} className="flex items-center gap-4">

                  {/* Channel Logo */}
                  <div
                    
                  >
                    <Image
                      src={channel.logo || "/placeholder.png"}
                      alt={channel.name}
                      width={60}
                      height={30}
                      className=" p-2  rounded-xl flex-shrink-0 w-20 h-15 flex items-center justify-center cursor-pointer transition-all "
                    />
                  </div>

                  {/* Program Info Bar */}
                  <div className="flex-1 bg-[#2D2D2D] rounded-lg h-12 flex items-center px-4">
                    <div className="text-gray-400 text-sm">
                      {channel.isActive ? "Now Playing: Current Program" : "Program Information"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
