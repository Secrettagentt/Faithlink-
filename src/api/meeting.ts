import { queryClient } from "@/utils/react-query";
import { localStorageGetItem } from "@/utils/storage-available";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { endpoints, fetcher, mutator } from "../utils/axios";
import { queryKeys } from "../utils/react-query";

export function useGetAllMeetings() {
  const token = localStorageGetItem("token");

  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: queryKeys.meeting.root,
    queryFn: () =>
      fetcher(endpoints.meeting.root, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    staleTime: 0,
    enabled: !!token,
  });

  return useMemo(
    () => ({
      meetings: data ?? [],
      refetchMeetings: refetch,
      isPendingMeetings: isPending,
      errorMeetings: error,
    }),
    [data, isPending, refetch, error]
  );
}

export function useGetMeetingById(id: string) {
  const token = localStorageGetItem("token");

  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: [queryKeys.meeting.id, id],
    queryFn: () =>
      fetcher(`${endpoints.meeting.root}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!id || !!token,
  });

  return useMemo(
    () => ({
      meeting: data ?? null,
      refetchMeeting: refetch,
      isPendingMeeting: isPending,
      errorMeeting: error,
    }),
    [data, isPending, refetch, id, error]
  );
}

export function useCreateMeeting() {
  const token = localStorageGetItem("token");
  const { mutateAsync, isPending, data } = useMutation<any, any, any>({
    mutationFn: (values: any) =>
      mutator({
        method: "POST",
        url: endpoints.meeting.root,
        data: values,
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meeting.root });
    },
  });

  return useMemo(
    () => ({
      createMeeting: mutateAsync,
      isCreatingMeeting: isPending,
      createdMeeting: data,
    }),
    [mutateAsync, isPending, data]
  );
}

export function useEditMeeting() {
  const { mutateAsync, isPending, data } = useMutation<
    any,
    any,
    { id: string; values: any }
  >({
    mutationFn: ({ id, values }) =>
      mutator({
        method: "PUT",
        url: `${endpoints.meeting.root}/${id}`,
        data: values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meeting.root });
    },
  });

  return useMemo(
    () => ({
      editMeeting: mutateAsync,
      isEditingMeeting: isPending,
      editedMeeting: data,
    }),
    [mutateAsync, isPending, data]
  );
}

export function useDeleteMeeting() {
  const { mutateAsync, isPending, data } = useMutation<any, any, string>({
    mutationFn: (id: string) =>
      mutator({
        method: "DELETE",
        url: `${endpoints.meeting.root}/${id}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meeting.root });
    },
  });

  return useMemo(
    () => ({
      deleteMeeting: mutateAsync,
      isDeletingMeeting: isPending,
      deletedMeeting: data,
    }),
    [mutateAsync, isPending, data]
  );
}

export function useGenerateAgoraToken() {
  const { mutateAsync, isPending, data } = useMutation<
    any,
    any,
    { channelName: string; date: string | Date }
  >({
    mutationFn: ({ channelName, date }) =>
      mutator({
        method: "POST",
        url: `${endpoints.meeting.root}/agora`,
        data: { channelName, date },
      }),
  });

  return useMemo(
    () => ({
      generateToken: mutateAsync,
      isGeneratingToken: isPending,
      tokenData: data,
    }),
    [mutateAsync, isPending, data]
  );
}
