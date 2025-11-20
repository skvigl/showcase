import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST || "",
});

export const fetcher = async <T>(url: string): Promise<T | null> => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return null;
      }

      throw err;
    }

    throw new Error("Unknown error");
  }
};
