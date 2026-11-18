import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchFeed(page = 1, limit = 12) {
  const { data } = await apiClient.get('/feed', {
    params: { page, limit },
  });
  return data;
}

export async function submitSwipe(profileId, action) {
  const { data } = await apiClient.post('/swipe', {
    profileId,
    action,
  });
  return data;
}

export async function fetchMatches() {
  const { data } = await apiClient.get('/matches');
  return data;
}

export async function resetDemoDeck() {
  await apiClient.post('/demo/reset');
}
