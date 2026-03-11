import { vi } from 'vitest';

export const setupGlobalResizeObserver = (): void => {
  globalThis.ResizeObserver = vi.fn().mockImplementation(function () {
    return {
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn(),
    };
  });
};

export const setupGlobalMatchMedia = (): void => {
  globalThis.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};
