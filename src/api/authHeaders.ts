import type { AxiosRequestConfig } from 'axios';

function authHeaders(authToken: string) {
  const headers: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  return headers;
}

export { authHeaders };
