jest.mock('axios', () => {
  const mockRequestUse = jest.fn();
  const mockResponseUse = jest.fn();

  return {
    __esModule: true,
    AxiosHeaders: class MockAxiosHeaders {
      constructor(headers = {}) {
        Object.assign(this, headers);
      }

      set(name, value) {
        Object.assign(this, { [name]: value });
      }
    },
    default: {
      create: jest.fn(() => ({
        interceptors: {
          request: { use: mockRequestUse },
          response: { use: mockResponseUse },
        },
      })),
    },
  };
});

import {
  applyAuthorizationHeader,
  getStoredAuthToken,
  handleApiResponseError,
} from './axiosInstance';

describe('axiosInstance helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads a token from stored user data', () => {
    const storage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ token: 'token-123' })),
      removeItem: jest.fn(),
    };

    expect(getStoredAuthToken(storage)).toBe('token-123');
  });

  it('clears malformed stored auth data', () => {
    const storage = {
      getItem: jest.fn().mockReturnValue('{invalid json'),
      removeItem: jest.fn(),
    };

    expect(getStoredAuthToken(storage)).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith('user');
    expect(storage.removeItem).toHaveBeenCalledWith('loginTimeStamp');
  });

  it('adds the authorization header when a token exists', () => {
    const storage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ token: 'token-123' })),
      removeItem: jest.fn(),
    };
    const config = { headers: {} } as any;

    expect(applyAuthorizationHeader(config, storage).headers.Authorization).toBe('Bearer token-123');
  });

  it('clears stored auth on a 401 response', async () => {
    const storage = {
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
    const error = { response: { status: 401 } };

    await expect(handleApiResponseError(error, storage)).rejects.toEqual(error);
    expect(storage.removeItem).toHaveBeenCalledWith('user');
    expect(storage.removeItem).toHaveBeenCalledWith('loginTimeStamp');
  });
});
