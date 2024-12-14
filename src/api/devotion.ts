import { queryClient } from "@/utils/react-query";
import { localStorageGetItem } from "@/utils/storage-available";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { endpoints, fetcher, mutator } from "../utils/axios";
import { queryKeys } from "../utils/react-query";

export function useGetAllDevotions() {
  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: queryKeys.devotion.root,
    queryFn: () => fetcher(endpoints.devotion.root),
    staleTime: 0,
  });

  return useMemo(
    () => ({
      devotions: data ?? [],
      refetchDevotions: refetch,
      isPendingDevotions: isPending,
      errorDevotions: error,
    }),
    [data, isPending, refetch, error]
  );
}

export function useGetDevotionById(id: string) {
  const token = localStorageGetItem("token");

  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: [queryKeys.devotion.id, id],
    queryFn: () =>
      fetcher(`${endpoints.devotion.root}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!id,
  });

  return useMemo(
    () => ({
      devotion: data ?? null,
      refetchDevotion: refetch,
      isPendingDevotion: isPending,
      errorDevotion: error,
    }),
    [data, isPending, refetch, id, error]
  );
}

export function useCreateDevotion() {
  const token = localStorageGetItem("token");
  const { mutateAsync, isPending, data } = useMutation<any, any, any>({
    mutationFn: (values: any) =>
      mutator({
        method: "POST",
        url: endpoints.devotion.root,
        data: values,
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devotion.root });
    },
  });

  return useMemo(
    () => ({
      createDevotion: mutateAsync,
      isCreatingDevotion: isPending,
      createdDevotion: data,
    }),
    [mutateAsync, isPending, data]
  );
}

export function useEditDevotion() {
  const { mutateAsync, isPending, data } = useMutation<
    any,
    any,
    { id: string; values: any }
  >({
    mutationFn: ({ id, values }) =>
      mutator({
        method: "PUT",
        url: `${endpoints.devotion.root}/${id}`,
        data: values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devotion.root });
    },
  });

  return useMemo(
    () => ({
      editDevotion: mutateAsync,
      isEditingDevotion: isPending,
      editedDevotion: data,
    }),
    [mutateAsync, isPending, data]
  );
}

export function useDeleteDevotion() {
  const { mutateAsync, isPending, data } = useMutation<any, any, string>({
    mutationFn: (id: string) =>
      mutator({
        method: "DELETE",
        url: `${endpoints.devotion.root}/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devotion.root });
    },
  });

  return useMemo(
    () => ({
      deleteDevotion: mutateAsync,
      isDeletingDevotion: isPending,
      deletedDevotion: data,
    }),
    [mutateAsync, isPending, data]
  );
}
