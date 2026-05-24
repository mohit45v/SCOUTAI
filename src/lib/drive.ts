const functionUrl = import.meta.env.VITE_DRIVE_EXPORT_FUNCTION_URL;

/**
 * Triggers the Firebase Cloud Function to convert a report HTML layout to a document,
 * upload it to Google Drive, and return a publicly shareable view link.
 */
export const exportToDrive = async (
  playerId: string,
  playerName: string,
  reportHtml: string
): Promise<{ success: boolean; fileId: string; viewLink: string }> => {
  if (!functionUrl) {
    throw new Error('Drive export Cloud Function URL is not defined in environment variables.');
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerId, playerName, reportHtml }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Export request failed with status: ${response.status}`);
  }

  return response.json();
};
