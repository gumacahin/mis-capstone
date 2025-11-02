import { vi } from "vitest";

// Mock functions for common use cases
export const createMockFunction = () => vi.fn();

// Mock API responses
export const createMockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: {},
});

// Mock user interactions
export const mockUser = {
  click: (element: HTMLElement) => {
    element.click();
  },
  type: (element: HTMLElement, text: string) => {
    element.focus();
    (element as HTMLInputElement).value = text;
    element.dispatchEvent(new Event("input", { bubbles: true }));
  },
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

// Mock window.location
export const mockLocation = (url: string) => {
  Object.defineProperty(window, "location", {
    value: new URL(url),
    writable: true,
  });
};
