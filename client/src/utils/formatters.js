export function formatMatchDate(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function extractErrorMessage(err) {
  if (err?.response?.status === 429) {
    return (
      err.response?.data?.error ||
      'Too many requests. Please wait a moment before trying again.'
    );
  }
  if (err?.response?.data?.error) {
    return err.response.data.error;
  }
  if (err?.message) {
    return err.message;
  }
  return 'Something went wrong communicating with the server.';
}
