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

export enum ROLES {
  OWNER = 4,
  ADMIN = 3,
  TRUSTED = 2,
  USER = 1,
  LOSER = 0,
}

export interface ServerType {
  name: string;
  permissions: PermissionsType;
  users: ServerUserType[];
}

export interface ServerUserType {
  name: string;
  role: ROLES;
}

export interface PermissionsType {
  canstart: boolean;
  canstop: boolean;
  cansave: boolean;
  caninvite: boolean;
}

export interface UserType {
  email: string;
  name: string;
  id: string;
  imageUrl?: string;
  authorized: boolean;
  servers: UserServerType[];
}

export interface UserServerType {
  name: string;
  role: ROLES;
}

export interface InviteType {
  id: number;
  userEmail: string;
  serverId: string;
}

export class MiddlewareError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string, stack?: unknown) {
    super(message); // 'Error' breaks prototype chain here
    this.name = "MiddlewareError";
    this.stack = JSON.stringify(stack);
    this.statusCode = statusCode;
  }
}
