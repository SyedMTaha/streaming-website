import React, { useState, useEffect } from 'react'
import { compressImage, validateFileSize, formatFileSize } from '../utils/imageCompression'

// Helper function to safely fetch and parse JSON
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    // Try to parse as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error(`Non-JSON response: ${text.substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biographical",
  "Blaxplotation",
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
  
  // State for file objects
  const [moviePortraitFile, setMoviePortraitFile] = useState(null);
  const [movieLandscapeFile, setMovieLandscapeFile] = useState(null);
  const [seriesPortraitFile, setSeriesPortraitFile] = useState(null);
  const [seriesLandscapeFile, setSeriesLandscapeFile] = useState(null);
  const [cartoonPortraitFile, setCartoonPortraitFile] = useState(null);
  const [cartoonLandscapeFile, setCartoonLandscapeFile] = useState(null);

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

  // Upload loading states to prevent duplicate submissions
  const [isMovieUploading, setIsMovieUploading] = useState(false);
  const [isSeriesUploading, setIsSeriesUploading] = useState(false);
  const [isCartoonUploading, setIsCartoonUploading] = useState(false);
  
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

  // Handle episode count change for TV Series - preserve existing links
  const handleSeriesEpisodeCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    const currentLinks = [...seriesEpisodeLinks];
    
    if (newCount > seriesEpisodeCount) {
      // Adding more episodes - preserve existing and add empty slots
      const additionalEpisodes = newCount - seriesEpisodeCount;
      const newLinks = [...currentLinks, ...Array(additionalEpisodes).fill("")];
      setSeriesEpisodeLinks(newLinks);
    } else if (newCount < seriesEpisodeCount) {
      // Reducing episodes - keep only the first 'newCount' episodes
      const trimmedLinks = currentLinks.slice(0, newCount);
      setSeriesEpisodeLinks(trimmedLinks);
    }
    
    setSeriesEpisodeCount(newCount);
  };

  // Handle episode link change for TV Series
  const handleSeriesEpisodeLinkChange = (idx, value) => {
    setSeriesEpisodeLinks((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  // Handle episode count change for Cartoon - preserve existing links
  const handleCartoonEpisodeCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    const currentLinks = [...cartoonEpisodeLinks];
    
    if (newCount > cartoonEpisodeCount) {
      // Adding more episodes - preserve existing and add empty slots
      const additionalEpisodes = newCount - cartoonEpisodeCount;
      const newLinks = [...currentLinks, ...Array(additionalEpisodes).fill("")];
      setCartoonEpisodeLinks(newLinks);
    } else if (newCount < cartoonEpisodeCount) {
      // Reducing episodes - keep only the first 'newCount' episodes
      const trimmedLinks = currentLinks.slice(0, newCount);
      setCartoonEpisodeLinks(trimmedLinks);
    }
    
    setCartoonEpisodeCount(newCount);
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
    fetch('/api/movies')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => setMovieList(data.movies || []))
      .catch(error => {
        console.error('Failed to fetch movies:', error);
        setMovieList([]);
      });
  }, []);

  // Fetch all TV series and cartoons on mount
  useEffect(() => {
    // Fetch TV series from movies API
    fetch('/api/movies')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        } 
        return res.json();
      })
      .then(data => {
        // Filter TV series from all movies data
        const tvSeries = (data.movies || []).filter(item => item.genre === 'tv-series');
        setSeriesList(tvSeries);
        // Filter cartoons from all movies data
        const cartoons = (data.movies || []).filter(item => item.genre === 'cartoon');
        setCartoonList(cartoons);
      })
      .catch(error => {
        console.error('Failed to fetch TV series and cartoons:', error);
        setSeriesList([]);
        setCartoonList([]);
      });
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
    (c.cartoonTitle || c.title)?.toLowerCase().includes(cartoonSearch.toLowerCase())
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
      await fetch('/api/movies', {
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
    if (isMovieUploading) return;
    setIsMovieUploading(true);
    try {
      setSuccessMessage('Uploading images and saving movie...');
      
      // Upload images to ImageKit first
      const imageFormData = new FormData();
      
      // Add portrait image if provided
      if (movieData.portraitFile) {
        imageFormData.append('portrait', movieData.portraitFile);
      }
      
      // Add landscape image if provided
      if (movieData.landscapeFile) {
        imageFormData.append('landscape', movieData.landscapeFile);
      }
      
      imageFormData.append('genre', movieData.genre);
      imageFormData.append('title', movieData.title);

      let imageUrls = {};
      
      // Only upload images if files are provided
      if (movieData.portraitFile || movieData.landscapeFile) {
        const imageResponse = await fetch('/api/upload-movie-images', {
          method: 'POST',
          body: imageFormData,
        });
        
        // Check if response is ok and contains JSON
        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          setSuccessMessage(`Failed to upload images: HTTP ${imageResponse.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let imageResult;
        try {
          imageResult = await imageResponse.json();
        } catch (jsonError) {
          const responseText = await imageResponse.text();
          setSuccessMessage(`Failed to parse image upload response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (!imageResult.success) {
          setSuccessMessage('Failed to upload images: ' + imageResult.error);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        imageUrls = imageResult.images;
      }

      // Prepare movie data for database
      const movieDataForDb = {
        title: movieData.title,
        description: movieData.description,
        genre: movieData.genre,
        year: movieData.year,
        duration: movieData.duration,
        rating: movieData.rating,
        link: movieData.link,
        // Use ImageKit URLs
        imageUrl: imageUrls.portrait?.url || movieData.imageUrl || '',
        innerImageUrl: imageUrls.landscape?.url || movieData.innerImageUrl || '',
        imageFileId: imageUrls.portrait?.fileId || '',
        innerImageFileId: imageUrls.landscape?.fileId || '',
      };

      if (editingMovieId) {
        // Update existing movie
        const res = await fetch('/api/movies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMovieId, ...movieDataForDb }),
        });
        
        // Check if response is ok and contains JSON
        if (!res.ok) {
          const errorText = await res.text();
          setSuccessMessage(`Failed to update movie: HTTP ${res.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let result;
        try {
          result = await res.json();
        } catch (jsonError) {
          const responseText = await res.text();
          setSuccessMessage(`Failed to parse update response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (result.success) {
          setSuccessMessage('Movie updated successfully!');
          setEditingMovieId(null);
          // Refresh list
          safeFetch('/api/movies').then(data => setMovieList(data.movies || [])).catch(error => {
            console.error('Failed to refresh movie list:', error);
          });
        } else {
          setSuccessMessage('Failed to update movie: ' + result.message);
        }
      } else {
        // Add new movie
        const res = await fetch('/api/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieDataForDb),
        });
        
        // Check if response is ok and contains JSON
        if (!res.ok) {
          const errorText = await res.text();
          setSuccessMessage(`Failed to add movie: HTTP ${res.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let result;
        try {
          result = await res.json();
        } catch (jsonError) {
          const responseText = await res.text();
          setSuccessMessage(`Failed to parse add movie response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (result.success) {
          setSuccessMessage('Movie added successfully!');
          // Refresh list
          safeFetch('/api/movies').then(data => setMovieList(data.movies || [])).catch(error => {
            console.error('Failed to refresh movie list:', error);
          });
        } else {
          setSuccessMessage('Failed to add movie: ' + result.message);
        }
      }

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
      
      // Hide the notification after 7 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
      
    } catch (error) {
      console.error('Error uploading movie:', error);
      setSuccessMessage('Error uploading movie: ' + error.message);
      setTimeout(() => setSuccessMessage(''), 7000);
    } finally {
      setIsMovieUploading(false);
    }
  };

  const handleEditSeries = (series) => {
    setSeriesTitle(series.title);
    setSeriesDescription(series.description);
    setSeriesGenre(series.genre || 'TV Series');
    setSeriesDuration(series.duration);
    setSeriesRating(series.rating);
    setSeriesYear(series.year);
    setSeriesPortrait(series.image?.split('/').pop() || '');
    setSeriesLandscape(series.innerImage?.split('/').pop() || '');
    
    // Extract episode URLs from episodes array with proper handling
    const episodeUrls = series.episodes?.map(ep => ep.videoUrl) || [];
    const episodeCount = Math.max(episodeUrls.length, 1); // At least 1 episode
    
    // Ensure we have the right number of episode slots (pad with empty strings if needed)
    const paddedEpisodeUrls = [...episodeUrls];
    while (paddedEpisodeUrls.length < episodeCount) {
      paddedEpisodeUrls.push('');
    }
    
    setSeriesEpisodeLinks(paddedEpisodeUrls);
    setSeriesEpisodeCount(episodeCount);
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
    if (isSeriesUploading) return;
    setIsSeriesUploading(true);
    let timeoutId;
    try {
      // Check if we're in production and add more time for uploads
      const isProduction = process.env.NODE_ENV === 'production';
      const uploadTimeout = isProduction ? 30000 : 60000; // 30s prod, 60s dev
      
      setSuccessMessage('Starting TV series upload...');
      
      // Create abort controller for request timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
        setSuccessMessage('Upload timed out. Please try with fewer episodes or smaller images.');
      }, uploadTimeout);
      
      // Upload images to ImageKit first
      const imageFormData = new FormData();
      
      // Add portrait image if provided
      if (seriesPortraitFile) {
        imageFormData.append('portrait', seriesPortraitFile);
      }
      
      // Add landscape image if provided
      if (seriesLandscapeFile) {
        imageFormData.append('landscape', seriesLandscapeFile);
      }
      
      imageFormData.append('genre', 'tv-series');
      imageFormData.append('title', seriesData.title);

      let imageUrls = {};
      
      // Only upload images if files are provided
      if (seriesPortraitFile || seriesLandscapeFile) {
        const imageResponse = await fetch('/api/upload-movie-images', {
          method: 'POST',
          body: imageFormData,
        });
        
        // Check if response is ok and contains JSON
        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          setSuccessMessage(`Failed to upload images: HTTP ${imageResponse.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let imageResult;
        try {
          imageResult = await imageResponse.json();
        } catch (jsonError) {
          const responseText = await imageResponse.text();
          setSuccessMessage(`Failed to parse image upload response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (!imageResult.success) {
          setSuccessMessage('Failed to upload images: ' + imageResult.error);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        imageUrls = imageResult.images;
      }

      // Prepare series data for the new API
      const seriesDataForDb = {
        title: seriesData.title,
        description: seriesData.description,
        year: seriesData.year,
        duration: seriesData.duration,
        rating: seriesData.rating,
        episodes: seriesData.episodes,
        // Use ImageKit URLs
        imageUrl: imageUrls.portrait?.url || seriesData.imageUrl || '',
        innerImageUrl: imageUrls.landscape?.url || seriesData.innerImageUrl || '',
        imageFileId: imageUrls.portrait?.fileId || '',
        innerImageFileId: imageUrls.landscape?.fileId || ''
      };

      if (editingSeriesId) {
        // Update existing series
        const res = await fetch('/api/add-series', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingSeriesId, ...seriesDataForDb }),
        });
        
        // Check if response is ok and contains JSON
        if (!res.ok) {
          const errorText = await res.text();
          setSuccessMessage(`Failed to update TV Series: HTTP ${res.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let result;
        try {
          result = await res.json();
        } catch (jsonError) {
          const responseText = await res.text();
          setSuccessMessage(`Failed to parse update response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (result.success) {
          setSuccessMessage('TV Series updated successfully!');
          setEditingSeriesId(null);
          // Refresh list
          safeFetch('/api/movies').then(data => {
            const tvSeries = (data.movies || []).filter(item => item.genre === 'tv-series');
            setSeriesList(tvSeries);
          }).catch(error => {
            console.error('Failed to refresh series list:', error);
          });
        } else {
          setSuccessMessage('Failed to update TV Series: ' + result.message);
        }
      } else {
        // Add new series with timeout control
        const res = await fetch('/api/add-series', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seriesDataForDb),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Check if response is ok and contains JSON
        if (!res.ok) {
          const errorText = await res.text();
          setSuccessMessage(`Failed to add TV Series: HTTP ${res.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let result;
        try {
          result = await res.json();
        } catch (jsonError) {
          const responseText = await res.text();
          setSuccessMessage(`Failed to parse add TV Series response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (result.success) {
          setSuccessMessage('TV Series added successfully!');
          // Refresh list
          safeFetch('/api/movies').then(data => {
            const tvSeries = (data.movies || []).filter(item => item.genre === 'tv-series');
            setSeriesList(tvSeries);
          }).catch(error => {
            console.error('Failed to refresh series list:', error);
          });
        } else {
          setSuccessMessage('Failed to add TV Series: ' + result.message);
        }
      }

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
        setSeriesPortraitFile(null);
        setSeriesLandscapeFile(null);
        setSeriesEpisodeCount(1);
        setSeriesEpisodeLinks(['']);
      }, 5000);
      
      // Hide the notification after 7 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
      
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Error uploading TV series:', error);
      
      let errorMessage = 'Error uploading TV series: ';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Upload timed out. Please try with fewer episodes or smaller images.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('413')) {
        errorMessage += 'File too large. Please use smaller images.';
      } else {
        errorMessage += error.message;
      }
      
      setSuccessMessage(errorMessage);
      setTimeout(() => setSuccessMessage(''), 10000); // Show error longer
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsSeriesUploading(false);
    }
  };

  const handleEditCartoon = (cartoon) => {
    setCartoonTitle(cartoon.title || cartoon.cartoonTitle || '');
    setCartoonDescription(cartoon.description || '');
    setCartoonGenre('Cartoon');
    setCartoonDuration(cartoon.duration || '');
    setCartoonRating(cartoon.rating || '');
    setCartoonYear(cartoon.year || '');
    setCartoonPortrait(cartoon.image?.split('/').pop() || '');
    setCartoonLandscape(cartoon.innerImage?.split('/').pop() || '');
    
    // Extract episode URLs from episodes array with proper handling
    const episodeUrls = cartoon.episodes?.map(ep => ep.videoUrl) || [];
    const episodeCount = Math.max(episodeUrls.length, 1); // At least 1 episode
    
    // Ensure we have the right number of episode slots (pad with empty strings if needed)
    const paddedEpisodeUrls = [...episodeUrls];
    while (paddedEpisodeUrls.length < episodeCount) {
      paddedEpisodeUrls.push('');
    }
    
    setCartoonEpisodeLinks(paddedEpisodeUrls);
    setCartoonEpisodeCount(episodeCount);
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
    if (isCartoonUploading) return;
    setIsCartoonUploading(true);
    try {
      setSuccessMessage('Uploading images and saving cartoon...');
      
      // Upload images to ImageKit first
      const imageFormData = new FormData();
      
      // Add portrait image if provided
      if (cartoonPortraitFile) {
        imageFormData.append('portrait', cartoonPortraitFile);
      }
      
      // Add landscape image if provided
      if (cartoonLandscapeFile) {
        imageFormData.append('landscape', cartoonLandscapeFile);
      }
      
      imageFormData.append('genre', 'cartoon');
      imageFormData.append('title', cartoonData.cartoonTitle);

      let imageUrls = {};
      
      // Only upload images if files are provided
      if (cartoonPortraitFile || cartoonLandscapeFile) {
        const imageResponse = await fetch('/api/upload-movie-images', {
          method: 'POST',
          body: imageFormData,
        });
        
        // Check if response is ok and contains JSON
        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          setSuccessMessage(`Failed to upload images: HTTP ${imageResponse.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let imageResult;
        try {
          imageResult = await imageResponse.json();
        } catch (jsonError) {
          const responseText = await imageResponse.text();
          setSuccessMessage(`Failed to parse image upload response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (!imageResult.success) {
          setSuccessMessage('Failed to upload images: ' + imageResult.error);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        imageUrls = imageResult.images;
      }

      // Prepare cartoon data for the new API
      const cartoonDataForDb = {
        cartoonTitle: cartoonData.cartoonTitle,
        description: cartoonData.description,
        year: cartoonData.year,
        duration: cartoonData.duration,
        rating: cartoonData.rating,
        episodes: cartoonData.episodes,
        // Use ImageKit URLs - preserve existing ones if no new upload
        imageUrl: imageUrls.portrait?.url || '',
        innerImageUrl: imageUrls.landscape?.url || '',
        imageFileId: imageUrls.portrait?.fileId || '',
        innerImageFileId: imageUrls.landscape?.fileId || ''
      };

      if (editingCartoonId) {
        // Update existing cartoon
        const res = await fetch('/api/add-cartoon', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCartoonId, ...cartoonDataForDb }),
        });
        
        // Check if response is ok and contains JSON
        if (!res.ok) {
          const errorText = await res.text();
          setSuccessMessage(`Failed to update cartoon: HTTP ${res.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let result;
        try {
          result = await res.json();
        } catch (jsonError) {
          const responseText = await res.text();
          setSuccessMessage(`Failed to parse update response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (result.success) {
          setSuccessMessage('Cartoon updated successfully!');
          setEditingCartoonId(null);
          // Refresh list
          safeFetch('/api/movies').then(data => {
            const cartoons = (data.movies || []).filter(item => item.genre === 'cartoon');
            setCartoonList(cartoons);
          }).catch(error => {
            console.error('Failed to refresh cartoon list:', error);
          });
        } else {
          setSuccessMessage('Failed to update cartoon: ' + result.message);
        }
      } else {
        // Add new cartoon
        const res = await fetch('/api/add-cartoon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartoonDataForDb),
        });
        
        // Check if response is ok and contains JSON
        if (!res.ok) {
          const errorText = await res.text();
          setSuccessMessage(`Failed to add cartoon: HTTP ${res.status} - ${errorText}`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        let result;
        try {
          result = await res.json();
        } catch (jsonError) {
          const responseText = await res.text();
          setSuccessMessage(`Failed to parse add cartoon response: ${responseText.substring(0, 100)}...`);
          setTimeout(() => setSuccessMessage(''), 7000);
          return;
        }
        
        if (result.success) {
          setSuccessMessage('Cartoon added successfully!');
          // Refresh list
          safeFetch('/api/movies').then(data => {
            const cartoons = (data.movies || []).filter(item => item.genre === 'cartoon');
            setCartoonList(cartoons);
          }).catch(error => {
            console.error('Failed to refresh cartoon list:', error);
          });
        } else {
          setSuccessMessage('Failed to add cartoon: ' + result.message);
        }
      }

      // Clear form fields after 5 seconds
      setTimeout(() => {
        setCartoonTitle('');
        setCartoonDescription('');
        setCartoonGenre('Cartoon');
        setCartoonDuration('');
        setCartoonRating('');
        setCartoonYear('');
        setCartoonPortrait('');
        setCartoonLandscape('');
        setCartoonPortraitFile(null);
        setCartoonLandscapeFile(null);
        setCartoonEpisodeCount(1);
        setCartoonEpisodeLinks(['']);
      }, 5000);
      
      // Hide the notification after 7 seconds
      setTimeout(() => setSuccessMessage(''), 7000);
      
    } catch (error) {
      console.error('Error uploading cartoon:', error);
      setSuccessMessage('Error uploading cartoon: ' + error.message);
      setTimeout(() => setSuccessMessage(''), 7000);
    } finally {
      setIsCartoonUploading(false);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl items-stretch">

        {/* Movie Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full h-full" style={{ minWidth: 340, maxWidth: 380 }}>
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
          <form className="flex flex-col gap-3 w-full flex-grow">
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
              className="rounded px-3 py-2 mb-08 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
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
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file size
                      if (!validateFileSize(file, 10)) {
                        setSuccessMessage(`Portrait image too large (${formatFileSize(file.size)}). Maximum 10MB allowed.`);
                        setTimeout(() => setSuccessMessage(''), 5000);
                        return;
                      }
                      
                      setSuccessMessage(`Compressing portrait image (${formatFileSize(file.size)})...`);
                      try {
                        const compressedFile = await compressImage(file, 800, 1200, 0.85);
                        setMoviePortrait(file.name);
                        setMoviePortraitFile(compressedFile);
                        setSuccessMessage(`Portrait compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
                        setTimeout(() => setSuccessMessage(''), 3000);
                      } catch (error) {
                        console.error('Compression failed:', error);
                        setMoviePortrait(file.name);
                        setMoviePortraitFile(file);
                        setSuccessMessage('Compression failed, using original image');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }
                    }
                  }}
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
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validate file size
                      if (!validateFileSize(file, 10)) {
                        setSuccessMessage(`Landscape image too large (${formatFileSize(file.size)}). Maximum 10MB allowed.`);
                        setTimeout(() => setSuccessMessage(''), 5000);
                        return;
                      }
                      
                      setSuccessMessage(`Compressing landscape image (${formatFileSize(file.size)})...`);
                      try {
                        const compressedFile = await compressImage(file, 1920, 1080, 0.85);
                        setMovieLandscape(file.name);
                        setMovieLandscapeFile(compressedFile);
                        setSuccessMessage(`Landscape compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
                        setTimeout(() => setSuccessMessage(''), 3000);
                      } catch (error) {
                        console.error('Compression failed:', error);
                        setMovieLandscape(file.name);
                        setMovieLandscapeFile(file);
                        setSuccessMessage('Compression failed, using original image');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }
                    }
                  }}
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
            <div className="flex-grow"></div>
            <button
              type="button"
              disabled={isMovieUploading}
              className={`bg-[#1D50A3] text-white rounded px-4 py-2 mt-4 hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed`}
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
                portraitFile: moviePortraitFile,
                landscapeFile: movieLandscapeFile,
              })}
            >
              {isMovieUploading ? 'Uploading...' : (editingMovieId ? 'Update Movie' : 'Upload Movie')}
            </button>
          </form>
        </div>

        {/* TV Series Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full h-full" style={{ minWidth: 340, maxWidth: 380 }}>
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
          <form className="flex flex-col gap-3 w-full flex-grow">
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
              <p className="text-xs text-gray-400">
                💡 Tip: Existing episode links are preserved when increasing count. Green fields show saved episodes.
              </p>
              <div className="text-xs text-blue-400">
                Episodes with content: {seriesEpisodeLinks.filter(link => link && link.trim() !== '').length}/{seriesEpisodeCount}
              </div>
            </div>
            {/* Episode Links Inputs */}
            <div
              style={{ height: 120, overflowY: 'auto', overscrollBehavior: 'contain' }}
              className="flex flex-col gap-2 border border-[#223366] bg-[#10162A] rounded p-2 overflow-y-auto overscroll-contain"
              tabIndex={0}
              onWheel={(e) => {
                e.stopPropagation();
                const container = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = container;
                const isScrollingDown = e.deltaY > 0;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight;
                
                if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
                  e.preventDefault();
                }
              }}
              onMouseEnter={(e) => {
                // Disable locomotive scroll when hovering over episode container
                document.body.style.overflow = 'hidden';
              }}
              onMouseLeave={(e) => {
                // Re-enable locomotive scroll when leaving episode container
                document.body.style.overflow = '';
              }}
            >
              {seriesEpisodeLinks.map((link, idx) => {
                const hasContent = link && link.trim() !== '';
                return (
                  <div key={idx} className="relative">
                    <input
                      className={`rounded px-3 py-2 w-full text-white placeholder-gray-400 ${
                        hasContent 
                          ? 'bg-[#2A4D3A] border border-green-600' // Green background for filled episodes
                          : 'bg-[#191C33] border border-transparent' // Default for empty episodes
                      }`}
                      placeholder={`Episode Link #${idx + 1}${hasContent ? ' (Saved)' : ' (New)'}`}
                      value={link}
                      onChange={e => handleSeriesEpisodeLinkChange(idx, e.target.value)}
                    />
                    {hasContent && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white">Portrait Thumbnail</label>
              <div className="flex items-center gap-2">
                <input
                  id="seriesPortrait"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files[0];
                    setSeriesPortrait(file?.name || "");
                    setSeriesPortraitFile(file);
                  }}
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
                  onChange={e => {
                    const file = e.target.files[0];
                    setSeriesLandscape(file?.name || "");
                    setSeriesLandscapeFile(file);
                  }}
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
            <div className="flex-grow"></div>
            <button
              type="button"
              disabled={isSeriesUploading}
              className={`bg-[#1D50A3] text-white rounded px-4 py-2 mt-4 hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed`}
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
              {isSeriesUploading ? 'Uploading...' : (editingSeriesId ? 'Update TV Series' : 'Upload TV Series')}
            </button>
          </form>
        </div>

        {/* Cartoon Upload */}
        <div className="bg-[#191C33] rounded-lg p-6 shadow-lg flex flex-col items-center w-full h-full" style={{ minWidth: 340, maxWidth: 380 }}>
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
                    <span className="text-white text-sm truncate" style={{ maxWidth: 120 }}>{cartoon.title || cartoon.cartoonTitle} ({cartoon.year})</span>
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
          <form className="flex flex-col gap-3 w-full flex-grow">
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
              <p className="text-xs text-gray-400">
                💡 Tip: Existing episode links are preserved when increasing count. Green fields show saved episodes.
              </p>
              <div className="text-xs text-blue-400">
                Episodes with content: {cartoonEpisodeLinks.filter(link => link && link.trim() !== '').length}/{cartoonEpisodeCount}
              </div>
            </div>
            {/* Episode Links Inputs */}
            <div
              style={{ height: 120, overflowY: 'auto', overscrollBehavior: 'contain' }}
              className="flex flex-col gap-2 border border-[#223366] bg-[#10162A] rounded p-2 overflow-y-auto overscroll-contain"
              tabIndex={0}
              onWheel={(e) => {
                e.stopPropagation();
                const container = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = container;
                const isScrollingDown = e.deltaY > 0;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight;
                
                if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
                  e.preventDefault();
                }
              }}
              onMouseEnter={(e) => {
                // Disable locomotive scroll when hovering over episode container
                document.body.style.overflow = 'hidden';
              }}
              onMouseLeave={(e) => {
                // Re-enable locomotive scroll when leaving episode container
                document.body.style.overflow = '';
              }}
            >
              {cartoonEpisodeLinks.map((link, idx) => {
                const hasContent = link && link.trim() !== '';
                return (
                  <div key={idx} className="relative">
                    <input
                      className={`rounded px-3 py-2 w-full text-white placeholder-gray-400 ${
                        hasContent 
                          ? 'bg-[#2A4D3A] border border-green-600' // Green background for filled episodes
                          : 'bg-[#191C33] border border-transparent' // Default for empty episodes
                      }`}
                      placeholder={`Episode Link #${idx + 1}${hasContent ? ' (Saved)' : ' (New)'}`}
                      value={link}
                      onChange={e => handleCartoonEpisodeLinkChange(idx, e.target.value)}
                    />
                    {hasContent && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white">Portrait Thumbnail</label>
              <div className="flex items-center gap-2">
                <input
                  id="cartoonPortrait"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files[0];
                    setCartoonPortrait(file?.name || "");
                    setCartoonPortraitFile(file);
                  }}
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
                  onChange={e => {
                    const file = e.target.files[0];
                    setCartoonLandscape(file?.name || "");
                    setCartoonLandscapeFile(file);
                  }}
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
            <div className="flex-grow"></div>
            <button type="button" disabled={isCartoonUploading} className="bg-[#1D50A3] text-white rounded px-4 py-2 mt-4 hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleCartoonUpload({
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
              {isCartoonUploading ? 'Uploading...' : (editingCartoonId ? 'Update Cartoon Episode' : 'Upload Cartoon Episode')}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  )
}

export default dashboardPage
