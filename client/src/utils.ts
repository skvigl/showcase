import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || "";

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

type Result<T> = { ok: true; data: T } | { ok: false; error: Error };

export async function fetcherSSR<T>(url: string): Promise<Result<T>> {
  try {
    const res = await fetch(BASE_URL + url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return { ok: false, error: new Error(`HTTP ${res.status}`) };
    }

    const data = (await res.json()) as T;

    return { ok: true, data };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error : new Error("Unknown error") };
  }
}
