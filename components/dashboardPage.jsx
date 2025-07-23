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

  //Movies state
  const [movieTitle, setMovieTitle] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [movieDuration, setMovieDuration] = useState('');
  const [movieRating, setMovieRating] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieLink, setMovieLink] = useState('');
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');

  // TV Series episode state
  const [seriesEpisodeCount, setSeriesEpisodeCount] = useState(1);
  const [seriesEpisodeLinks, setSeriesEpisodeLinks] = useState([""]);

  // Cartoon episode state
  const [cartoonEpisodeCount, setCartoonEpisodeCount] = useState(1);
  const [cartoonEpisodeLinks, setCartoonEpisodeLinks] = useState([""]);

  // TV Series form fields state
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDescription, setSeriesDescription] = useState('');
  const [seriesGenre, setSeriesGenre] = useState('TV Series');
  const [seriesDuration, setSeriesDuration] = useState('');
  const [seriesRating, setSeriesRating] = useState('');
  const [seriesYear, setSeriesYear] = useState('');

  // Handle episode count change for TV Series
  const handleSeriesEpisodeCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setSeriesEpisodeCount(count);
    setSeriesEpisodeLinks(Array(count).fill(""));
  };

  // Handle episode link change for TV Series
  const handleSeriesEpisodeLinkChange = (idx, value) => {
    setSeriesEpisodeLinks((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  // Handle episode count change for Cartoon
  const handleCartoonEpisodeCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setCartoonEpisodeCount(count);
    setCartoonEpisodeLinks(Array(count).fill(""));
  };

  // Handle episode link change for Cartoon
  const handleCartoonEpisodeLinkChange = (idx, value) => {
    setCartoonEpisodeLinks((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };
  

  const handleMovieUpload = async (movieData) => {
    const res = await fetch('/api/add-movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
    if (res.ok) {
      setSuccessMessage('Movie added successfully!');
      // Clear all movie form fields
      setMovieTitle('');
      setMovieDescription('');
      setMovieGenre('');
      setMovieDuration('');
      setMovieRating('');
      setMovieYear('');
      setMovieLink('');
      setMoviePortrait('');
      setMovieLandscape('');
      // Hide the notification after 3 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
    } else {
      setSuccessMessage('Failed to add movie');
      setTimeout(() => setSuccessMessage(''), 7000);
    }
  };

  const handleSeriesUpload = async (seriesData) => {
    const res = await fetch('/api/add-series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seriesData),
    });
    if (res.ok) {
      setSuccessMessage('TV Series added successfully!');
      // Clear all TV series form fields
      // setSeriesTitle(''); // These states are not in the current form
      // setSeriesDescription('');
      // setSeriesGenre('');
      // setSeriesDuration('');
      // setSeriesRating('');
      // setSeriesYear('');
      // setSeriesPortrait('');
      // setSeriesLandscape('');
      // setSeriesEpisodeCount(1); // Reset episode count
      // setSeriesEpisodeLinks([""]); // Reset episode links
      // Hide the notification after 3 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
    } else {
      setSuccessMessage('Failed to add TV Series');
      setTimeout(() => setSuccessMessage(''), 7000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 bg-gradient-to-t from-[#020E21] via-[#091F4E] to-[#020D23]">
      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold animate-fade-in-out">
          {successMessage}
        </div>
      )}
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl items-start">

        {/* Movie Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full" style={{ minWidth: 340, maxWidth: 380 }}>
          <h2 className="text-xl font-semibold text-white mb-4">Upload Movie</h2>
          <form className="flex flex-col gap-3 w-full">
            <input
              className="rounded px-3 py-2"
              placeholder="Title"
              value={movieTitle}
              onChange={e => setMovieTitle(e.target.value)}
            />
            <textarea
              className="rounded px-3 py-2"
              placeholder="Description"
              value={movieDescription}
              onChange={e => setMovieDescription(e.target.value)}
            />
            <select
              className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={movieGenre}
              onChange={e => setMovieGenre(e.target.value)}
            >
              <option value="" disabled>Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <input
              className="rounded px-3 py-2"
              placeholder="Duration (e.g. 2 hrs 20 mins)"
              value={movieDuration}
              onChange={e => setMovieDuration(e.target.value)}
            />
            <input
              className="rounded px-3 py-2"
              placeholder="Rating (e.g. 8.5)"
              value={movieRating}
              onChange={e => setMovieRating(e.target.value)}
            />
            <input
              className="rounded px-3 py-2"
              placeholder="Year Released"
              value={movieYear}
              onChange={e => setMovieYear(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 mb-40"
              placeholder="Movie Link"
              value={movieLink}
              onChange={e => setMovieLink(e.target.value)}
            />
            {/* Portrait Thumbnail aligned like other cards */}
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
            <button
              type="button"
              className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-2 hover:bg-blue-900 transition"
              onClick={() => handleMovieUpload({
                title: movieTitle,
                description: movieDescription,
                genre: movieGenre,
                duration: movieDuration,
                rating: movieRating,
                year: movieYear,
                link: movieLink,
                portrait: moviePortrait,
                landscape: movieLandscape,
              })}
            >
              Upload Movie
            </button>
          </form>
        </div>

        {/* TV Series Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full" style={{ minWidth: 340, maxWidth: 380 }}>
          <h2 className="text-xl font-semibold text-white mb-4">Upload TV Series</h2>
          <form className="flex flex-col gap-3 w-full">
            <input
              className="rounded px-3 py-2"
              placeholder="Title"
              value={seriesTitle}
              onChange={e => setSeriesTitle(e.target.value)}
            />
            <textarea
              className="rounded px-3 py-2"
              placeholder="Description"
              value={seriesDescription}
              onChange={e => setSeriesDescription(e.target.value)}
            />
            <select
              className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={seriesGenre}
              onChange={e => setSeriesGenre(e.target.value)}
            >
              <option value="TV Series">TV Series</option>
            </select>
            <input
              className="rounded px-3 py-2"
              placeholder="Duration (e.g. 45 mins)"
              value={seriesDuration}
              onChange={e => setSeriesDuration(e.target.value)}
            />
            <input
              className="rounded px-3 py-2"
              placeholder="Rating (e.g. 8.5)"
              value={seriesRating}
              onChange={e => setSeriesRating(e.target.value)}
            />
            <input
              className="rounded px-3 py-2"
              placeholder="Year Released"
              value={seriesYear}
              onChange={e => setSeriesYear(e.target.value)}
            />
            {/* Episode Number Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-white">Number of Episodes</label>
              <select
                className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3]"
                value={seriesEpisodeCount}
                onChange={handleSeriesEpisodeCountChange}
              >
                {Array.from({ length: 25 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            {/* Episode Links Inputs */}
            <div
              style={{ height: 120, overflowY: 'auto' }}
              className="flex flex-col gap-2 border border-[#223366] bg-[#10162A] rounded p-2"
            >
              {seriesEpisodeLinks.map((link, idx) => (
                <input
                  key={idx}
                  className="rounded px-3 py-2 bg-[#191C33] text-white placeholder-gray-400"
                  placeholder={`Episode Link #${idx + 1}`}
                  value={link}
                  onChange={e => handleSeriesEpisodeLinkChange(idx, e.target.value)}
                />
              ))}
            </div>
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
            <button
              type="button"
              className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-2 hover:bg-blue-900 transition"
              onClick={() => handleSeriesUpload({
                title: seriesTitle,
                description: seriesDescription,
                genre: seriesGenre,
                duration: seriesDuration,
                rating: seriesRating,
                year: seriesYear,
                portrait: seriesPortrait,
                landscape: seriesLandscape,
                episodes: seriesEpisodeLinks,
              })}
            >
              Upload TV Series
            </button>
          </form>
        </div>

        {/* Cartoon Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full" style={{ minWidth: 340, maxWidth: 380 }}>
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
            {/* Episode Number Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-white">Number of Episodes</label>
              <select
                className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3]"
                value={cartoonEpisodeCount}
                onChange={handleCartoonEpisodeCountChange}
              >
                {Array.from({ length: 25 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            {/* Episode Links Inputs */}
            <div
              style={{ height: 120, overflowY: 'auto' }}
              className="flex flex-col gap-2 border border-[#223366] bg-[#10162A] rounded p-2"
            >
              {cartoonEpisodeLinks.map((link, idx) => (
                <input
                  key={idx}
                  className="rounded px-3 py-2 bg-[#191C33] text-white placeholder-gray-400"
                  placeholder={`Episode Link #${idx + 1}`}
                  value={link}
                  onChange={e => handleCartoonEpisodeLinkChange(idx, e.target.value)}
                />
              ))}
            </div>
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
