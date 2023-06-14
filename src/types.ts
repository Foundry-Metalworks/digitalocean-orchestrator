import { RequireAuthProp } from "@clerk/clerk-sdk-node";
import { Request } from "express";

export interface DOData {
  token: string;
  server: string;
  id?: string;
}

export interface DODropletData extends DOData {
  id: string;
}

export interface DORequest extends RequireAuthProp<Request> {
  droplet: DOData;
}

export interface DropletRequest extends DORequest {
  droplet: DOData & { id: string };
}
