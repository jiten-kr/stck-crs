import axios, { AxiosError, AxiosHeaders } from "axios";

// Create Axios instance with a base URL pointing to Next.js API routes
const api = axios.create({
  baseURL: "/api",
  withCredentials: false,
});

// Request interceptor: attach auth token from localStorage if present
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const headers = (config.headers ??= new AxiosHeaders());
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalize errors and handle auth issues
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    // If unauthorized/forbidden, optionally clear token and redirect to sign-in
    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // We do not navigate here to avoid side effects in hooks/components.
        // Callers can handle navigation based on the thrown error code.
      }
    }

    // Build a normalized error message
    const message =
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);

export default api;
