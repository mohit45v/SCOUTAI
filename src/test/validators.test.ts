import { describe, it, expect } from 'vitest';
import { validateFile } from '../lib/validators';

const createMockFile = (name: string, type: string, size: number, magicBytes: number[]) => {
  const content = new Uint8Array(size);
  if (magicBytes && magicBytes.length > 0) {
    content.set(magicBytes);
  }
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

describe('validateFile', () => {
  it('should accept a valid JPEG file under 10MB', async () => {
    const file = createMockFile('test.jpg', 'image/jpeg', 1000, [0xFF, 0xD8, 0xFF, 0xE0]);
    const res = await validateFile(file);
    expect(res.valid).toBe(true);
  });

  it('should accept a valid PNG file under 10MB', async () => {
    const file = createMockFile('test.png', 'image/png', 1000, [0x89, 0x50, 0x4E, 0x47]);
    const res = await validateFile(file);
    expect(res.valid).toBe(true);
  });

  it('should reject a file that exceeds 10MB', async () => {
    const oversizedFile = createMockFile('large.jpg', 'image/jpeg', 11 * 1024 * 1024, [0xFF, 0xD8, 0xFF, 0xE0]);
    const res = await validateFile(oversizedFile);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('size exceeds');
  });

  it('should reject unsupported MIME types like PDF', async () => {
    const pdfFile = createMockFile('test.pdf', 'application/pdf', 1000, [0x25, 0x50, 0x44, 0x46]);
    const res = await validateFile(pdfFile);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Invalid file type');
  });

  it('should reject if magic bytes mismatch the MIME type', async () => {
    // JPEG MIME but PNG magic bytes
    const badFile = createMockFile('test.jpg', 'image/jpeg', 1000, [0x89, 0x50, 0x4E, 0x47]);
    const res = await validateFile(badFile);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('magic bytes mismatch');
  });
});
