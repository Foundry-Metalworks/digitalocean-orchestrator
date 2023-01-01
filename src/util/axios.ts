import { AxiosInstance } from "axios";
import { ParsedQs } from "qs";

export const get = async (
  axios: AxiosInstance,
  url: string,
  params: ParsedQs = {}
) => {
  return await axios.get(url, { params });
};

export const post = async (
  axios: AxiosInstance,
  url: string,
  data: ParsedQs = {}
) => {
  return await axios.post(url, data);
};

export const patch = async (
  axios: AxiosInstance,
  url: string,
  data: ParsedQs = {}
) => {
  return await axios.patch(url, data);
};

export const remove = async (axios: AxiosInstance, url: string) => {
  return await axios.delete(url);
};
