const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(
  endpoint: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 10000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(rest.headers ?? {}),
      },
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit & { timeout?: number }) =>
    request<T>(endpoint, { method: "GET", ...options }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit & { timeout?: number }) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),
  put: <T>(endpoint: string, body: unknown, options?: RequestInit & { timeout?: number }) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
  del: <T>(endpoint: string, options?: RequestInit & { timeout?: number }) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
