import cache from "memory-cache";
import axios, { AxiosInstance } from "axios";
import { Request } from "express";

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

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const getData = (
  req: Request,
  values: string[]
): { [key: string]: any } => {
  const data: { [key: string]: any } = {};
  for (const value of values) {
    data[value] = req.params[value] || req.query[value] || req.body[value];
  }
  return data;
};
