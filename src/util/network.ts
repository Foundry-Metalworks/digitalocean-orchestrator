import cache from "memory-cache";
import axios, { AxiosInstance } from "axios";

const axiosCache = new cache.Cache<string, AxiosInstance>();

export const getDOAxiosInstance = (token: string): AxiosInstance => {
  let instance: AxiosInstance | null = axiosCache.get(token);
  if (!instance) {
    instance = axios.create({
      baseURL: "https://api.digitalocean.com/v2",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    axiosCache.put(token, instance);
  }
  return instance;
};
