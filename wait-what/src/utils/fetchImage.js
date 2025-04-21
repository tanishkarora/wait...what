export async function fetchImageForQuery(query) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        {
          headers: {
            Authorization: process.env.REACT_APP_PEXELS_API_KEY
          }
        }
      );
  
      const data = await res.json();
      return data.photos?.[0]?.src?.medium || null;
    } catch (error) {
      console.error("Failed to fetch image from Pexels:", error);
      return null;
    }
  }
  