import { resolveApiBaseUrl } from './API';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('resolveApiBaseUrl', () => {
  const originalApiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.REACT_APP_API_BASE_URL = originalApiBaseUrl;
  });

  it('returns the configured API base URL without a trailing slash', () => {
    process.env.REACT_APP_API_BASE_URL = 'https://example.com/api/';

    expect(resolveApiBaseUrl()).toBe('https://example.com/api');
  });

  it('falls back to localhost when no environment variable is provided', () => {
    delete process.env.REACT_APP_API_BASE_URL;

    expect(resolveApiBaseUrl()).toBe('http://localhost:5000/api');
  });
});
