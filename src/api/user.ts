import { queryClient } from "@/utils/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { endpoints, fetcher, mutator } from "../utils/axios";
import { queryKeys } from "../utils/react-query";

export function useGetUser(id: string) {
  const { data, isLoading, refetch, error } = useQuery<any>({
    queryKey: queryKeys.user.root,
    queryFn: () => fetcher(endpoints.user.root, { params: { id } }),
    staleTime: 0,
    enabled: !!id,
  });

  return useMemo(
    () => ({
      profileData: data ?? null,
      profileRefetch: refetch,
      profileLoading: isLoading,
      profileError: error,
      isNotFound: (error as any)?.response?.status === 404,
    }),
    [data, isLoading, refetch, id, error]
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
