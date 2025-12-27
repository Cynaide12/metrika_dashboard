import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Login, Logout, Register } from "@/api/api";
import { ACCESS_TOKEN_QUERY_KEY } from "@/components/blocks/Forms/Login";
import { RegisterRequest } from "@/api/types";

// Хук для логина
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return Login({ email: data.email, password: data.password });
    },
    onSuccess: ({ status, data }) => {
      queryClient.setQueryData([ACCESS_TOKEN_QUERY_KEY], data?.token, );
    },
  });
}

// Хук для регистрации
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return Register(data);
    },
    onSuccess: ({ data }) => {
      queryClient.setQueryData([ACCESS_TOKEN_QUERY_KEY], data?.token);
    },
  });
}

// Хук для выхода
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ACCESS_TOKEN_QUERY_KEY,
        exact: true,
      });
    },
  });
}

// Хук для доступа к токену
export default function useAccessToken() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [ACCESS_TOKEN_QUERY_KEY],
    queryFn: async () => {
      const token = queryClient.getQueryData<string>([ACCESS_TOKEN_QUERY_KEY]);
      if (!token) throw new Error("No access token in cache");
      return token;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });
}
