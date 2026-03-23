jest.mock('./axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import axiosInstance from './axiosInstance';
import { login, getWorkplaces } from './API';
import { resolveApiBaseUrl } from './apiConfig';

const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('resolveApiBaseUrl', () => {
  const originalApiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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

describe('API helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login posts credentials through the shared api client', async () => {
    const loginResponse = { id: 'emp1', token: 'token-123', role: 'user' };
    mockedAxiosInstance.post.mockResolvedValue({ data: loginResponse });

    await expect(login('emp1', 'password')).resolves.toEqual(loginResponse);
    expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/login', { id: 'emp1', password: 'password' });
  });

  it('getWorkplaces reads data through the shared api client', async () => {
    const workplaces = [{ id: 1, name: 'HQ', location: 'Tokyo' }];
    mockedAxiosInstance.get.mockResolvedValue({ data: workplaces });

    await expect(getWorkplaces()).resolves.toEqual(workplaces);
    expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/workplaces');
  });
});
