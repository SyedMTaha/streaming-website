import React, { useState, useEffect } from 'react'

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
  
  // Custom alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(null);

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
  
  const [movieList, setMovieList] = useState([]);
  const [movieSearch, setMovieSearch] = useState('');
  const [editingMovieId, setEditingMovieId] = useState(null);

  // TV Series state for list/search/edit
  const [seriesList, setSeriesList] = useState([]);
  const [seriesSearch, setSeriesSearch] = useState('');
  const [editingSeriesId, setEditingSeriesId] = useState(null);

  // Cartoons state for list/search/edit
  const [cartoonList, setCartoonList] = useState([]);
  const [cartoonSearch, setCartoonSearch] = useState('');
  const [editingCartoonId, setEditingCartoonId] = useState(null);

  // Cartoon form fields state
  const [cartoonTitle, setCartoonTitle] = useState('');
  const [cartoonDescription, setCartoonDescription] = useState('');
  const [cartoonGenre, setCartoonGenre] = useState('Cartoon');
  const [cartoonDuration, setCartoonDuration] = useState('');
  const [cartoonRating, setCartoonRating] = useState('');
  const [cartoonYear, setCartoonYear] = useState('');

  // Fetch all movies on mount and after changes
  useEffect(() => {
    fetch('/api/add-movie')
      .then(res => res.json())
      .then(data => setMovieList(data || []));
  }, []);

  // Fetch all TV series and cartoons on mount
  useEffect(() => {
    // Fetch TV series from movies.json instead of episodes
    fetch('/api/add-movie')
      .then(res => res.json())
      .then(data => {
        // Filter TV series from all movies data
        const tvSeries = (data || []).filter(item => item.genre === 'tv-series');
        setSeriesList(tvSeries);
      });
    fetch('/api/add-cartoon')
      .then(res => res.json())
      .then(data => setCartoonList(data || []));
  }, []);

  const handleMovieSearch = (e) => setMovieSearch(e.target.value);
  const handleSeriesSearch = (e) => setSeriesSearch(e.target.value);
  const handleCartoonSearch = (e) => setCartoonSearch(e.target.value);

  const filteredMovies = movieList.filter(m =>
    m.title.toLowerCase().includes(movieSearch.toLowerCase())
  );
  const filteredSeries = seriesList.filter(s =>
    s.title?.toLowerCase().includes(seriesSearch.toLowerCase())
  );
  const filteredCartoons = cartoonList.filter(c =>
    c.cartoonTitle?.toLowerCase().includes(cartoonSearch.toLowerCase())
  );

  const handleEditMovie = (movie) => {
    setMovieTitle(movie.title);
    setMovieDescription(movie.description);
    setMovieGenre(movie.genre);
    setMovieDuration(movie.duration);
    setMovieRating(movie.rating);
    setMovieYear(movie.year);
    setMovieLink(movie.videoUrl);
    setMoviePortrait(movie.image?.split('/').pop() || '');
    setMovieLandscape(movie.innerImage?.split('/').pop() || '');
    setEditingMovieId(movie.id);
  };

  const handleDeleteMovie = (id) => {
    setAlertMessage('Are you sure you want to delete this movie?');
    setAlertAction(() => async () => {
      await fetch('/api/add-movie', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setMovieList(list => list.filter(m => m.id !== id));
      setSuccessMessage('Movie deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 7000);
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const handleMovieUpload = async (movieData) => {
    if (editingMovieId) {
      // Update
      const res = await fetch('/api/add-movie', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...movieData, id: editingMovieId }),
      });
      if (res.ok) {
        setSuccessMessage('Movie updated successfully!');
        setEditingMovieId(null);
        // Refresh list
        fetch('/api/add-movie').then(res => res.json()).then(data => setMovieList(data || []));
        // Clear form fields after 5 seconds
        setTimeout(() => {
          setMovieTitle('');
          setMovieDescription('');
          setMovieGenre('');
          setMovieDuration('');
          setMovieRating('');
          setMovieYear('');
          setMovieLink('');
          setMoviePortrait('');
          setMovieLandscape('');
        }, 5000);
      } else {
        setSuccessMessage('Failed to update movie');
      }
      setTimeout(() => setSuccessMessage(''), 7000);
      return;
    }
    const res = await fetch('/api/add-movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
    if (res.ok) {
      setSuccessMessage('Movie added successfully!');
      // Clear all movie form fields after 5 seconds
      setTimeout(() => {
        setMovieTitle('');
        setMovieDescription('');
        setMovieGenre('');
        setMovieDuration('');
        setMovieRating('');
        setMovieYear('');
        setMovieLink('');
        setMoviePortrait('');
        setMovieLandscape('');
      }, 5000);
      // Hide the notification after 7 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
    } else {
      setSuccessMessage('Failed to add movie');
      setTimeout(() => setSuccessMessage(''), 7000);
    }
  };

  const handleEditSeries = (series) => {
    setSeriesTitle(series.title);
    setSeriesDescription(series.description);
    setSeriesGenre(series.genre);
    setSeriesDuration(series.duration);
    setSeriesRating(series.rating);
    setSeriesYear(series.year);
    setSeriesPortrait(series.image?.split('/').pop() || '');
    setSeriesLandscape(series.innerImage?.split('/').pop() || '');
    setSeriesEpisodeLinks(series.episodes || []);
    setSeriesEpisodeCount((series.episodes || []).length);
    setEditingSeriesId(series.id);
  };
  const handleDeleteSeries = (id) => {
    setAlertMessage('Are you sure you want to delete this TV Series?');
    setAlertAction(() => async () => {
      await fetch('/api/add-series', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSeriesList(list => list.filter(s => s.id !== id));
      setSuccessMessage('TV Series deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 7000);
      setShowAlert(false);
    });
    setShowAlert(true);
  };
  const handleSeriesUpload = async (seriesData) => {
    // Generate slug from title
    const seriesSlug = seriesData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const dataWithSlug = { ...seriesData, slug: seriesSlug };
    
    if (editingSeriesId) {
      const res = await fetch('/api/add-series', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dataWithSlug, id: editingSeriesId }),
      });
      if (res.ok) {
        setSuccessMessage('TV Series updated successfully!');
        setEditingSeriesId(null);
        // Refresh TV series list
        fetch('/api/add-movie')
          .then(res => res.json())
          .then(data => {
            const tvSeries = (data || []).filter(item => item.genre === 'tv-series');
            setSeriesList(tvSeries);
          });
        // Clear form fields after 5 seconds
        setTimeout(() => {
          setSeriesTitle('');
          setSeriesDescription('');
          setSeriesGenre('TV Series');
          setSeriesDuration('');
          setSeriesRating('');
          setSeriesYear('');
          setSeriesPortrait('');
          setSeriesLandscape('');
          setSeriesEpisodeCount(1);
          setSeriesEpisodeLinks(['']);
        }, 5000);
      } else {
        setSuccessMessage('Failed to update TV Series');
      }
      setTimeout(() => setSuccessMessage(''), 7000);
      return;
    }
    const res = await fetch('/api/add-series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataWithSlug),
    });
    if (res.ok) {
      setSuccessMessage('TV Series added successfully!');
      // Refresh TV series list
      fetch('/api/add-movie')
        .then(res => res.json())
        .then(data => {
          const tvSeries = (data || []).filter(item => item.genre === 'tv-series');
          setSeriesList(tvSeries);
        });
      // Clear all TV series form fields after 5 seconds
      setTimeout(() => {
        setSeriesTitle('');
        setSeriesDescription('');
        setSeriesGenre('TV Series');
        setSeriesDuration('');
        setSeriesRating('');
        setSeriesYear('');
        setSeriesPortrait('');
        setSeriesLandscape('');
        setSeriesEpisodeCount(1);
        setSeriesEpisodeLinks(['']);
      }, 5000);
      // Hide the notification after 7 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
    } else {
      setSuccessMessage('Failed to add TV Series');
      setTimeout(() => setSuccessMessage(''), 7000);
    }
  };

  const handleEditCartoon = (cartoon) => {
    setCartoonTitle(cartoon.cartoonTitle || '');
    setCartoonDescription(cartoon.description || '');
    setCartoonGenre(cartoon.genre || 'Cartoon');
    setCartoonDuration(cartoon.duration || '');
    setCartoonRating(cartoon.rating || '');
    setCartoonYear(cartoon.year || '');
    setCartoonPortrait(cartoon.thumbnail?.split('/').pop() || '');
    setCartoonLandscape(''); // Not available in data
    setCartoonEpisodeLinks(cartoon.episodes || [cartoon.videoUrl] || ['']);
    setCartoonEpisodeCount((cartoon.episodes || [cartoon.videoUrl] || ['']).length);
    setEditingCartoonId(cartoon.id);
  };
  const handleDeleteCartoon = (id) => {
    setAlertMessage('Are you sure you want to delete this cartoon episode?');
    setAlertAction(() => async () => {
      await fetch('/api/add-cartoon', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setCartoonList(list => list.filter(c => c.id !== id));
      setSuccessMessage('Cartoon episode deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 7000);
      setShowAlert(false);
    });
    setShowAlert(true);
  };
  const handleCartoonUpload = async (cartoonData) => {
    if (editingCartoonId) {
      const res = await fetch('/api/add-cartoon', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cartoonData, id: editingCartoonId }),
      });
      if (res.ok) {
        setSuccessMessage('Cartoon episode updated successfully!');
        setEditingCartoonId(null);
        fetch('/api/add-cartoon').then(res => res.json()).then(data => setCartoonList(data || []));
      } else {
        setSuccessMessage('Failed to update cartoon episode');
      }
      setTimeout(() => setSuccessMessage(''), 7000);
      return;
    }
    const res = await fetch('/api/add-cartoon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartoonData),
    });
    if (res.ok) {
      setSuccessMessage('Cartoon episode added successfully!');
      // Clear all cartoon form fields
      setCartoonTitle('');
      setCartoonDescription('');
      setCartoonGenre('Cartoon');
      setCartoonDuration('');
      setCartoonRating('');
      setCartoonYear('');
      setCartoonPortrait('');
      setCartoonLandscape('');
      setCartoonEpisodeCount(1);
      setCartoonEpisodeLinks(['']);
      // Hide the notification after 3 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
    } else {
      setSuccessMessage('Failed to add cartoon episode');
      setTimeout(() => setSuccessMessage(''), 7000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-12 bg-gradient-to-t from-[#020E21] via-[#091F4E] to-[#020D23]">
      {/* Custom Alert Modal */}
      {showAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">{alertMessage}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={alertAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
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
          <div className="w-full mb-4">
            <input
              className="rounded px-3 py-2 w-full mb-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Search Movies..."
              value={movieSearch}
              onChange={handleMovieSearch}
            />
            {movieSearch && (
              <div style={{ maxHeight: 180, overflowY: 'auto' }} className="bg-[#10162A] rounded p-2 border border-[#223366] mb-2">
                {filteredMovies.map(movie => (
                  <div key={movie.id} className="flex items-center justify-between gap-2 py-1 border-b border-[#223366] last:border-b-0">
                    <span className="text-white text-sm truncate" style={{ maxWidth: 120 }}>{movie.title} ({movie.year})</span>
                    <div className="flex gap-1">
                      <button className="text-blue-400 hover:underline text-xs" onClick={() => handleEditMovie(movie)}>Edit</button>
                      <button className="text-red-400 hover:underline text-xs" onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {filteredMovies.length === 0 && <span className="text-gray-400 text-xs">No movies found.</span>}
              </div>
            )}
          </div>
          <form className="flex flex-col gap-3 w-full">
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Title"
              value={movieTitle}
              onChange={e => setMovieTitle(e.target.value)}
            />
            <textarea
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
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
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Duration (e.g. 2 hrs 20 mins)"
              value={movieDuration}
              onChange={e => setMovieDuration(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Rating (e.g. 8.5)"
              value={movieRating}
              onChange={e => setMovieRating(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Year Released"
              value={movieYear}
              onChange={e => setMovieYear(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 mb-40 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
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
              {editingMovieId ? 'Update Movie' : 'Upload Movie'}
            </button>
          </form>
        </div>

        {/* TV Series Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full" style={{ minWidth: 340, maxWidth: 380 }}>
          <h2 className="text-xl font-semibold text-white mb-4">Upload TV Series</h2>
          <div className="w-full mb-4">
            <input
              className="rounded px-3 py-2 w-full mb-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Search TV Series..."
              value={seriesSearch}
              onChange={handleSeriesSearch}
            />
            {seriesSearch && (
              <div style={{ maxHeight: 180, overflowY: 'auto' }} className="bg-[#10162A] rounded p-2 border border-[#223366] mb-2">
                {filteredSeries.map(series => (
                  <div key={series.id} className="flex items-center justify-between gap-2 py-1 border-b border-[#223366] last:border-b-0">
                    <span className="text-white text-sm truncate" style={{ maxWidth: 120 }}>{series.title} ({series.year})</span>
                    <div className="flex gap-1">
                      <button className="text-blue-400 hover:underline text-xs" onClick={() => handleEditSeries(series)}>Edit</button>
                      <button className="text-red-400 hover:underline text-xs" onClick={() => handleDeleteSeries(series.id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {filteredSeries.length === 0 && <span className="text-gray-400 text-xs">No TV Series found.</span>}
              </div>
            )}
          </div>
          <form className="flex flex-col gap-3 w-full">
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Title"
              value={seriesTitle}
              onChange={e => setSeriesTitle(e.target.value)}
            />
            <textarea
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
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
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Duration (e.g. 45 mins)"
              value={seriesDuration}
              onChange={e => setSeriesDuration(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Rating (e.g. 8.5)"
              value={seriesRating}
              onChange={e => setSeriesRating(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
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
              {editingSeriesId ? 'Update TV Series' : 'Upload TV Series'}
            </button>
          </form>
        </div>

        {/* Cartoon Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full" style={{ minWidth: 340, maxWidth: 380 }}>
          <h2 className="text-xl font-semibold text-white mb-4">Upload Cartoon</h2>
          <div className="w-full mb-4">
            <input
              className="rounded px-3 py-2 w-full mb-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Search Cartoons..."
              value={cartoonSearch}
              onChange={handleCartoonSearch}
            />
            {cartoonSearch && (
              <div style={{ maxHeight: 180, overflowY: 'auto' }} className="bg-[#10162A] rounded p-2 border border-[#223366] mb-2">
                {filteredCartoons.map(cartoon => (
                  <div key={cartoon.id} className="flex items-center justify-between gap-2 py-1 border-b border-[#223366] last:border-b-0">
                    <span className="text-white text-sm truncate" style={{ maxWidth: 120 }}>{cartoon.cartoonTitle}</span>
                    <div className="flex gap-1">
                      <button className="text-blue-400 hover:underline text-xs" onClick={() => handleEditCartoon(cartoon)}>Edit</button>
                      <button className="text-red-400 hover:underline text-xs" onClick={() => handleDeleteCartoon(cartoon.id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {filteredCartoons.length === 0 && <span className="text-gray-400 text-xs">No cartoons found.</span>}
              </div>
            )}
          </div>
          <form className="flex flex-col gap-3 w-full">
            <input
                className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                placeholder="Title"
                value={cartoonTitle}
                onChange={e => setCartoonTitle(e.target.value)}
              />
              <textarea
                className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                placeholder="Description"
                value={cartoonDescription}
                onChange={e => setCartoonDescription(e.target.value)}
              />
            <select
              className="rounded px-3 py-2 bg-[#091F4E] text-white border border-[#1D50A3] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={cartoonGenre}
              onChange={e => setCartoonGenre(e.target.value)}
            >
              <option value="" disabled>Select Genre</option>
              <option value="Cartoon">Cartoon</option>
            </select>
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Duration (e.g. 25 mins)"
              value={cartoonDuration}
              onChange={e => setCartoonDuration(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Rating (e.g. 8.5)"
              value={cartoonRating}
              onChange={e => setCartoonRating(e.target.value)}
            />
            <input
              className="rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              placeholder="Year Released"
              value={cartoonYear}
              onChange={e => setCartoonYear(e.target.value)}
            />
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
            <button type="button" className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-2 hover:bg-blue-900 transition" onClick={() => handleCartoonUpload({
              cartoonTitle: cartoonTitle,
              description: cartoonDescription,
              genre: cartoonGenre,
              duration: cartoonDuration,
              rating: cartoonRating,
              year: cartoonYear,
              thumbnail: cartoonPortrait,
              landscape: cartoonLandscape,
              videoUrl: cartoonEpisodeLinks[0],
              episodes: cartoonEpisodeLinks,
            })}>
              {editingCartoonId ? 'Update Cartoon Episode' : 'Upload Cartoon Episode'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  )
}

export default dashboardPage
