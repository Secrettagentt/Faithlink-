import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/",
});

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T extends any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const mutator = async <Data>(
  request: AxiosRequestConfig
): Promise<Data> => {
  try {
    const res = await axiosInstance(request);
    return res.data;
  } catch (e: any) {
    if (e instanceof AxiosError) {
      throw e.response as any;
    }
    throw e;
  }
};

export const endpoints = {
  user: {
    root: "/user",
    register: "/users/register",
    all: "/users/all",
  },
  meeting: {
    root: "/meeting",
  },
  devotion: {
    root: "/devotionals",
  },
  message: {
    root: "/messages",
  },
};
