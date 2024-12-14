import { queryClient } from "@/utils/react-query";
import { localStorageGetItem } from "@/utils/storage-available";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { endpoints, fetcher, mutator } from "../utils/axios";
import { queryKeys } from "../utils/react-query";

export function useGetUser() {
  const token = localStorageGetItem("token");
  const { data, isLoading, refetch, error } = useQuery<any>({
    queryKey: queryKeys.user.root,
    queryFn: () =>
      fetcher(endpoints.user.root, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 0,
    enabled: !!token,
  });

  return useMemo(
    () => ({
      profileData: data ?? null,
      profileRefetch: refetch,
      profileLoading: isLoading,
      profileError: error,
      isNotFound: (error as any)?.response?.status === 404,
    }),
    [data, isLoading, refetch, token, error]
  );
}

export function useGetAllUsers() {
  const token = localStorageGetItem("token");
  const { data, isLoading, refetch, error } = useQuery<any>({
    queryKey: queryKeys.user.allUsers,
    queryFn: () =>
      fetcher(`${endpoints.user.root}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 0,
    enabled: !!token,
  });

  return useMemo(
    () => ({
      usersData: data ?? null,
      usersRefetch: refetch,
      usersLoading: isLoading,
      usersError: error,
      isNotFound: (error as any)?.response?.status === 404,
    }),
    [data, isLoading, refetch, token, error]
  );
}

export function useGetUserById(id: string) {
  const token = localStorageGetItem("token");

  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: [queryKeys.user.root, id],
    queryFn: () =>
      fetcher(`${endpoints.user.root}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!id || !!token,
  });

  return useMemo(
    () => ({
      userDetail: data ?? null,
      refetchUser: refetch,
      isLoadingUser: isPending,
      error,
    }),
    [data, isPending, refetch, id, error]
  );
}

export function useRegister() {
  const { mutateAsync, data, isPending } = useMutation<any, any, any>({
    mutationFn: (values: any) =>
      mutator({
        method: "POST",
        data: values,
        url: endpoints.user.register,
        params: { ref: values.ref },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.root });
    },
  });

  return useMemo(
    () => ({
      register: mutateAsync,
      data,
      isRegistering: isPending,
    }),
    [mutateAsync, data, isPending]
  );
}
