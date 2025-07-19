import React, { useState } from 'react'

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "History",
  "Independent",
  "Inspiration",
  "Martial Arts",
  "Musical",
  "Mystery",
  "News",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western"
];

const dashboardPage = () => {
  // State for file names
  const [moviePortrait, setMoviePortrait] = useState("");
  const [movieLandscape, setMovieLandscape] = useState("");
  const [seriesPortrait, setSeriesPortrait] = useState("");
  const [seriesLandscape, setSeriesLandscape] = useState("");
  const [cartoonPortrait, setCartoonPortrait] = useState("");
  const [cartoonLandscape, setCartoonLandscape] = useState("");

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 bg-gradient-to-t from-[#020E21] via-[#091F4E] to-[#020D23]">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Movie Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Movie</h2>
          <form className="flex flex-col gap-3 w-full">
            <input className="rounded px-3 py-2" placeholder="Title" />
            <textarea className="rounded px-3 py-2" placeholder="Description" />
            <select className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" defaultValue="">
              <option value="" disabled>Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <input className="rounded px-3 py-2" placeholder="Duration (e.g. 2 hrs 20 mins)" />
            <input className="rounded px-3 py-2" placeholder="Rating (e.g. 8.5)" />
            <input className="rounded px-3 py-2" placeholder="Year Released" />
            <input className="rounded px-3 py-2" placeholder="Movie Link" />
            <div className="flex flex-col gap-2">
              <label className="text-white">Portrait Thumbnail</label>
              <div className="flex items-center gap-2">
                <input
                  id="moviePortrait"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setMoviePortrait(e.target.files[0]?.name || "")}
                />
                <label
                  htmlFor="moviePortrait"
                  className="bg-[#1D50A3] text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition"
                >
                  Upload Image
                </label>
                <span className="text-gray-300 text-sm truncate" style={{maxWidth: 120}}>
                  {moviePortrait || "No file chosen"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white">Landscape Image</label>
              <div className="flex items-center gap-2">
                <input
                  id="movieLandscape"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setMovieLandscape(e.target.files[0]?.name || "")}
                />
                <label
                  htmlFor="movieLandscape"
                  className="bg-[#1D50A3] text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition"
                >
                  Upload Image
                </label>
                <span className="text-gray-300 text-sm truncate" style={{maxWidth: 120}}>
                  {movieLandscape || "No file chosen"}
                </span>
              </div>
            </div>
            <button type="button" className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-2 hover:bg-blue-900 transition">Upload Movie</button>
          </form>
        </div>
        {/* TV Series Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Upload TV Series</h2>
          <form className="flex flex-col gap-3 w-full">
            <input className="rounded px-3 py-2" placeholder="Title" />
            <textarea className="rounded px-3 py-2" placeholder="Description" />
            <select className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" defaultValue="">
              <option value="" disabled>Select Genre</option>
              <option value="TV Series">TV Series</option>
            </select>
            <input className="rounded px-3 py-2" placeholder="Duration (e.g. 45 mins)" />
            <input className="rounded px-3 py-2" placeholder="Rating (e.g. 8.5)" />
            <input className="rounded px-3 py-2" placeholder="Year Released" />
            <input className="rounded px-3 py-2" placeholder="Episode Number" />
            <input className="rounded px-3 py-2" placeholder="Episode Link" />
            <div className="flex flex-col gap-2">
              <label className="text-white">Portrait Thumbnail</label>
              <div className="flex items-center gap-2">
                <input
                  id="seriesPortrait"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setSeriesPortrait(e.target.files[0]?.name || "")}
                />
                <label
                  htmlFor="seriesPortrait"
                  className="bg-[#1D50A3] text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition"
                >
                  Upload Image
                </label>
                <span className="text-gray-300 text-sm truncate" style={{maxWidth: 120}}>
                  {seriesPortrait || "No file chosen"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white">Landscape Image</label>
              <div className="flex items-center gap-2">
                <input
                  id="seriesLandscape"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setSeriesLandscape(e.target.files[0]?.name || "")}
                />
                <label
                  htmlFor="seriesLandscape"
                  className="bg-[#1D50A3] text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition"
                >
                  Upload Image
                </label>
                <span className="text-gray-300 text-sm truncate" style={{maxWidth: 120}}>
                  {seriesLandscape || "No file chosen"}
                </span>
              </div>
            </div>
            <button type="button" className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-2 hover:bg-blue-900 transition">Upload TV Series</button>
          </form>
        </div>
        {/* Cartoon Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Cartoon</h2>
          <form className="flex flex-col gap-3 w-full">
            <input className="rounded px-3 py-2" placeholder="Title" />
            <textarea className="rounded px-3 py-2" placeholder="Description" />
            <select className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" defaultValue="">
              <option value="" disabled>Select Genre</option>
              <option value="Cartoon">Cartoon</option>
            </select>
            <input className="rounded px-3 py-2" placeholder="Duration (e.g. 25 mins)" />
            <input className="rounded px-3 py-2" placeholder="Rating (e.g. 8.5)" />
            <input className="rounded px-3 py-2" placeholder="Year Released" />
            <input className="rounded px-3 py-2" placeholder="Episode Number" />
            <input className="rounded px-3 py-2" placeholder="Episode Link" />
            <div className="flex flex-col gap-2">
              <label className="text-white">Portrait Thumbnail</label>
              <div className="flex items-center gap-2">
                <input
                  id="cartoonPortrait"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setCartoonPortrait(e.target.files[0]?.name || "")}
                />
                <label
                  htmlFor="cartoonPortrait"
                  className="bg-[#1D50A3] text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition"
                >
                  Upload Image
                </label>
                <span className="text-gray-300 text-sm truncate" style={{maxWidth: 120}}>
                  {cartoonPortrait || "No file chosen"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white">Landscape Image</label>
              <div className="flex items-center gap-2">
                <input
                  id="cartoonLandscape"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setCartoonLandscape(e.target.files[0]?.name || "")}
                />
                <label
                  htmlFor="cartoonLandscape"
                  className="bg-[#1D50A3] text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition"
                >
                  Upload Image
                </label>
                <span className="text-gray-300 text-sm truncate" style={{maxWidth: 120}}>
                  {cartoonLandscape || "No file chosen"}
                </span>
              </div>
            </div>
            <button type="button" className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-2 hover:bg-blue-900 transition">Upload Cartoon</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default dashboardPage
