import { describe, it, expect, vi, beforeAll } from 'vitest';
import { resizeImage } from '../utils/imageProcessor';

// Mock Browser URL globals for Vitest environment
beforeAll(() => {
  if (typeof window !== 'undefined') {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
  } else {
    global.URL = {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    } as any;
  }
});

describe('imageProcessor resizeImage', () => {
  it('should scale down image dimensions proportionally to maximum 1024px', async () => {
    // Mock the HTML Image element
    const mockImage = {
      width: 2000,
      height: 1000,
      onload: null as any,
      set src(_val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    };
    vi.stubGlobal('Image', vi.fn(() => mockImage));

    // Mock HTML5 Canvas element
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({
        drawImage: vi.fn(),
      })),
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,mockbase64data'),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') return mockCanvas as any;
      return {} as any;
    });

    const mockFile = new File([new Uint8Array(100)], 'test.jpg', { type: 'image/jpeg' });
    const result = await resizeImage(mockFile);

    expect(result.mimeType).toBe('image/jpeg');
    expect(result.base64).toBe('mockbase64data');
    expect(mockCanvas.width).toBe(1024); // longest edge 2000 scaled to 1024
    expect(mockCanvas.height).toBe(512); // height 1000 scaled proportionally to 512
  });
});
