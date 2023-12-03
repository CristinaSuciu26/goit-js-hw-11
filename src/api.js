import axios from 'axios';

export const ENDPOINT = 'https://pixabay.com/api/';
export const API_KEY = '40929284-7575d21e88d2f3b61b50c775f';

export async function searchImages(searchTerm, currentPage) {
  const apiUrl = `${ENDPOINT}?key=${API_KEY}&q=${searchTerm}&image_type=photo&page=${currentPage}&per_page=40`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
