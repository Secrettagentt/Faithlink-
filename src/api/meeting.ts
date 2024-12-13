import { queryClient } from "@/utils/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { endpoints, fetcher, mutator } from "../utils/axios";
import { queryKeys } from "../utils/react-query";

export function useGetAllMeetings() {
  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: queryKeys.meeting.root,
    queryFn: () => fetcher(endpoints.meeting.root),
    staleTime: 0,
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
  const { data, isPending, refetch, error } = useQuery<any>({
    queryKey: [queryKeys.meeting.id, id],
    queryFn: () => fetcher(`${endpoints.meeting.root}/${id}`),
    enabled: !!id,
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
  const { mutateAsync, isPending, data } = useMutation<any, any, any>({
    mutationFn: (values: any) =>
      mutator({
        method: "POST",
        url: endpoints.meeting.root,
        data: values,
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
    { channelName: string; startDate: string | Date }
  >({
    mutationFn: ({ channelName, startDate }) =>
      mutator({
        method: "POST",
        url: `${endpoints.meeting.root}/agora/token`,
        data: { channelName, startDate },
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
