import { queryClient } from "@/utils/react-query";
import { localStorageGetItem } from "@/utils/storage-available";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { endpoints, fetcher, mutator } from "../utils/axios";
import { queryKeys } from "../utils/react-query";

export function useGetMessages(id: string) {
  const token = localStorageGetItem("token");

  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: [queryKeys.messages.root, id],
    queryFn: () =>
      fetcher(`${endpoints.message.root}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!id || !!token,
  });

  return useMemo(
    () => ({
      messages: data ?? null,
      refetchMessage: refetch,
      isLoadingMessage: isPending,
      error,
    }),
    [data, isPending, refetch, id, error]
  );
}

export function useSendMessage() {
  const token = localStorageGetItem("token");

  const { mutateAsync, data, isPending } = useMutation<any, any, any>({
    mutationFn: (values: any) =>
      mutator({
        method: "POST",
        data: values,
        url: endpoints.message.root,
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.root });
    },
  });

  return useMemo(
    () => ({
      sendMessage: mutateAsync,
      data,
      isMessaging: isPending,
    }),
    [mutateAsync, data, isPending]
  );
}
