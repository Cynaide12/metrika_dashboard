"use client";

import { config } from "@/config/config";
import { queryClient } from "@/providers/ReactQueryProvider";
import axios, { AxiosError } from "axios";
import { GuestsVisitsResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types";
import { ACCESS_TOKEN_QUERY_KEY } from "@/components/blocks/Forms/Login";

export const axiosInstance = axios.create({
  baseURL: config.BASE_API_URL,
  withCredentials: true,
});

// првоерка контекста выполнения
const isServer = typeof window === "undefined";

// Interceptor ответов - общий для серверного и клиентского контекстов
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as any;

    console.log(originalRequest.url)
    // если 401, пробуем обновить токен
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url != `${config.BASE_API_URL}/auth/login` &&
      originalRequest.url != `${config.BASE_API_URL}/auth/logout`
    ) {
      //чтобы избежать бесконечного цикла
      originalRequest._retry = true;


      // если на сервере — ничего не делаем, просто пробрасываем ошибку
      // так как по задумке каждый запрос, который идет от серверного компонента - ОБЯЗАН иметь актуальный access токен
      // и 401 ошибка в ответ на такой запрос - означает полную деавторизацию
      // и поэтому возвращаем эту ошибку чтобы можно было редиректить на /login
      if (isServer) return Promise.reject(error);

      //если на клиенте
      try {
        // пытаемся обновить токен
        const refreshRes = await axios.put(
          `${config.BASE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.token;

        //кладем в кэш access токен
        queryClient.setQueryData([ACCESS_TOKEN_QUERY_KEY], newAccessToken);

        // Повторяем исходный запрос
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        // если refresh тоже вернул 401 → logout || 500
        if (
          (refreshError?.response?.status === 401 ||
          refreshError?.response?.status === 500)
        ) {
          await Logout();
          queryClient.removeQueries({
            queryKey: ACCESS_TOKEN_QUERY_KEY,
            exact: true,
          });
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function Login(
  data: LoginRequest
): Promise<{ data?: LoginResponse; status: number }> {
  try {
    const res = await axiosInstance.post<LoginResponse>(
      `${config.BASE_API_URL}/auth/login`,
      data
    );
    return { data: res.data, status: res.status };
  } catch (e: any) {
    console.error(e);
    if (e.status == 401) throw new Error("Неправильный логин или пароль");
    // throw new AxiosError(e)
    throw e;
  }
}

export async function Register(
  data: RegisterRequest
): Promise<{ data?: RegisterResponse; status: number }> {
  try {
    const res = await axiosInstance.post<RegisterResponse>(
      `${config.BASE_API_URL}/auth/register`,
      data
    );
    return { data: res.data, status: res.status };
  } catch (e: any) {
    if(e.status == 409) throw new Error("Пользователь с таким email уже существует")
    console.error(e);
    // throw new AxiosError(e)
    throw e;
  }
}

export async function Logout(): Promise<Response> {
  try {
    const res = await axiosInstance.delete<Response>(
      `${config.BASE_API_URL}/auth/logout`
    );
    return res.data;
  } catch (e: any) {
    console.error("ошибка авторизации:", e.response.data.message);
    return e.response.data;
  }
}

export async function getGuestsVisits(
  domain_id: number
): Promise<GuestsVisitsResponse> {
  const token = queryClient.getQueryData([ACCESS_TOKEN_QUERY_KEY]);
  try {
    const res = await axiosInstance.get<GuestsVisitsResponse>(
      `${config.BASE_API_URL}/metrika/${domain_id}/guests/visits`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (e: any) {
    console.error("ошибка авторизации:", e.response?.data?.message);
    throw e;
  }
}
