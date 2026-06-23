import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useTenantStore } from "@/store/tenant.store";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.covaulty.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
    }
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Injecter le Tenant ID si résolu, SAUF pour les routes /institutions qui gèrent les tenants eux-mêmes
    if (!config.url?.startsWith("/institutions")) {
      const institution = useTenantStore.getState().institution;
      const user = useAuthStore.getState().user;
      
      if (institution) {
        config.headers["x-tenant-id"] = institution.id;
      } else if (user && user.institutionId && user.role !== "SUPER_ADMIN") {
        config.headers["x-tenant-id"] = user.institutionId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API RESPONSE SUCCESS] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[API RESPONSE ERROR]`, error.response?.data || error.message);
    }
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        if (newAccessToken) {
          const user = useAuthStore.getState().user;
          if (user) {
            useAuthStore.getState().setAuth(newAccessToken, user);
          }
          
          processQueue(null, newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        // En développement (CORS) ou si réseau instable, on ne déconnecte pas brutalement
        // On ne déconnecte que si le backend rejette explicitement le refresh (401/403)
        const status = refreshError.response?.status;
        if (status === 401 || status === 403) {
          useAuthStore.getState().clearAuth();
          if (typeof window !== "undefined") {
            window.location.hash = "#login";
          }
        } else if (process.env.NODE_ENV === "development") {
          console.error("[DEV] Refresh intercepté mais non-401 (CORS ou réseau). Déconnexion évitée.");
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
