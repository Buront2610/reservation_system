import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

test('renders login screen with the renovation overview', () => {
  const mockedAxios = require('axios').default;
  mockedAxios.get.mockResolvedValue({ data: { initialSetupRequired: false } });

  render(<App />);
  expect(screen.getByText('お弁当予約システム')).toBeInTheDocument();
  expect(screen.getByText('現行アプリの監査結果')).toBeInTheDocument();
  expect(screen.getByText('全面改修の方針')).toBeInTheDocument();
});
