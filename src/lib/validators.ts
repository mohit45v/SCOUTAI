/**
 * Validates file size, MIME type, and magic bytes.
 */
export const validateFile = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // 1. Check size (max 10MB)
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: 'File size exceeds the 10MB limit.' };
  }

  // 2. Check browser MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed formats: JPEG, PNG, WEBP, MP4.' };
  }

  // 3. Check magic bytes
  try {
    const firstBytes = await getFirstBytes(file, 12);
    const hex = Array.from(firstBytes)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

    let matchesMagicBytes = false;

    // JPEG starts with FF D8 FF
    if (hex.startsWith('FF D8 FF')) {
      matchesMagicBytes = file.type === 'image/jpeg';
    }
    // PNG starts with 89 50 4E 47
    else if (hex.startsWith('89 50 4E 47')) {
      matchesMagicBytes = file.type === 'image/png';
    }
    // WEBP starts with RIFF (52 49 46 46) and WEBP (57 45 42 50) at offset 8
    else if (hex.startsWith('52 49 46 46') && hex.substring(24, 35) === '57 45 42 50') {
      matchesMagicBytes = file.type === 'image/webp';
    }
    // MP4 starts with ftyp (66 74 79 70) starting at index 4
    else if (hex.substring(12, 23) === '66 74 79 70') {
      matchesMagicBytes = file.type === 'video/mp4';
    }

    if (!matchesMagicBytes) {
      return { valid: false, error: 'File type verification failed (magic bytes mismatch).' };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'Failed to verify file integrity.' };
  }
};

const getFirstBytes = (file: File, numBytes: number): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file.slice(0, numBytes));
  });
};
