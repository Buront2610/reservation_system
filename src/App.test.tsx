import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./compornents/axiosInstance', () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
  clearStoredAuth: jest.fn(),
  getStoredAuthToken: jest.fn(),
  applyAuthorizationHeader: jest.fn((config) => config),
  handleApiResponseError: jest.fn((error) => Promise.reject(error)),
}));

jest.mock('./compornents/API', () => ({
  __esModule: true,
  checkInitialSetup: jest.fn(),
  login: jest.fn(),
}));

test('renders login screen with the renovation overview', () => {
  render(<App />);
  expect(screen.getByText('お弁当予約システム')).toBeInTheDocument();
  expect(screen.getByText('現行アプリの監査結果')).toBeInTheDocument();
  expect(screen.getByText('全面改修の方針')).toBeInTheDocument();
});
