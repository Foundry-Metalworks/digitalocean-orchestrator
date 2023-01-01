import { AxiosInstance } from "axios";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceFunc<T extends unknown[]> = (axios: AxiosInstance, ...args: T) => any;