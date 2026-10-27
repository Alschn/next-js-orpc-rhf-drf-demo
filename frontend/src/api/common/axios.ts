import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

type CreateAxiosClientOptions = CreateAxiosDefaults;

export const createAxiosClient = (
  options?: CreateAxiosClientOptions,
): AxiosClientInstance => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
};

export type AxiosClientInstance = AxiosInstance;
