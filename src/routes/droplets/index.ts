import express from "express";
import dropletsController from "@/controllers/droplets";
import * as dotenv from "dotenv";
import {
  requireDroplet,
  requireNoActions,
  withServerInfo,
} from "@/middleware/droplets";
import { param } from "express-validator";
import validate from "@/middleware/validate";
import { requiresServerToExist } from "@/middleware/server";
import { requiresRole } from "@/middleware/permission";
import { ROLES } from "@/types";
import { requiresUserInServer } from "@/middleware/user";

dotenv.config();

const routes = express.Router();
const innerRoutes = express.Router({ mergeParams: true });
routes.use("/:serverId", innerRoutes);
innerRoutes.use(
  param("serverId").isAlpha(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  withServerInfo
);

innerRoutes.post(
  "/start",
  requiresRole(ROLES.USER),
  requireNoActions,
  dropletsController.onStartRequest
);
innerRoutes.post(
  "/stop",
  requiresRole(ROLES.ADMIN),
  requireDroplet,
  requireNoActions,
  dropletsController.onStopRequest
);
innerRoutes.post(
  "/save",
  requiresRole(ROLES.TRUSTED),
  requireDroplet,
  requireNoActions,
  dropletsController.onSaveRequest
);
innerRoutes.get("/ip", requireDroplet, dropletsController.onIPRequest);
innerRoutes.get("/status", dropletsController.onStatusRequest);

export default routes;
