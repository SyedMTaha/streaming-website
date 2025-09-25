// Utility functions for handling uploads efficiently

export function processEpisodesInBatches(episodeUrls, seriesData, slug, batchSize = 5) {
  const episodes = [];
  
  // Process episodes in smaller batches to avoid memory issues
  for (let i = 0; i < episodeUrls.length; i += batchSize) {
    const batch = episodeUrls.slice(i, i + batchSize);
    
    batch.forEach((episodeUrl, batchIndex) => {
      if (!episodeUrl) return;
      
      const episodeNumber = i + batchIndex + 1;
      const episodeTitle = `Episode ${episodeNumber}`;
      const episodeSlug = `episode-${episodeNumber}`;
      
      const episode = {
        id: `${slug}-ep${episodeNumber}`,
        title: episodeTitle,
        slug: episodeSlug,
        description: seriesData.description || `${seriesData.title} - ${episodeTitle}`,
        videoUrl: episodeUrl,
        duration: seriesData.episodeDuration || seriesData.duration || '30:00',
        thumbnail: seriesData.imageUrl || '',
        previousEpisode: episodeNumber > 1 ? `episode-${episodeNumber - 1}` : null,
        nextEpisode: episodeNumber < episodeUrls.length ? `episode-${episodeNumber + 1}` : null
      };
      
      episodes.push(episode);
    });
  }
  
  return episodes;
}

export function validateUploadData(data, requiredFields) {
  const errors = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  }
  
  return errors;
}

export function logUploadProgress(step, details = {}) {
  console.log(`[UPLOAD ${new Date().toISOString()}] ${step}:`, details);
}

export function createTimeoutPromise(ms, errorMessage = 'Operation timed out') {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
}

export async function withTimeout(promise, timeoutMs, errorMessage) {
  return Promise.race([
    promise,
    createTimeoutPromise(timeoutMs, errorMessage)
  ]);
}
