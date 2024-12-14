import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (err: any) => {
      if (err?.status === 403 && err?.data?.message) {
        enqueueSnackbar({ message: err.data.message, variant: "error" });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err: any) => {
      if (err?.data?.message) {
        if (err?.status === 403 || err?.status === 409) {
          enqueueSnackbar({ message: err.data.message, variant: "error" });
        }
      }
    },
  }),
});

export const queryKeys = {
  user: {
    root: [{ type: "user" }],
    allUsers: [{ type: "allUsers" }],
  },
  meeting: {
    root: [{ type: "meeting" }],
    id: [{ type: "meetingById" }],
  },
  devotion: {
    root: [{ type: "devotion" }],
    id: [{ type: "devotionById" }],
  },
};
