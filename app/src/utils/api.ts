/**
 * Fetch utility with automatic retry logic
 */
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  backoff: number = 1000
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        ...options.headers,
      },
    });

    if (!response.ok && retries > 0) {
      console.warn(`Fetch failed for ${url}. Retrying... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch error for ${url}: ${error}. Retrying... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};
