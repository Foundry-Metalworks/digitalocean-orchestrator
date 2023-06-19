import express from "express";
import dropletsController from "../controllers/droplets";
import * as dotenv from "dotenv";
import {
  requireDroplet,
  requireNoActions,
  withServerInfo,
} from "../middleware/droplets";
import { param } from "express-validator";
import validate from "../middleware/validate";
import { requiresServerToExist } from "../middleware/server";

dotenv.config();

const routes = express.Router();
const innerRoutes = express.Router({ mergeParams: true });
routes.use("/:serverId", innerRoutes);
innerRoutes.use(
  param("serverId").isAlpha(),
  validate,
  requiresServerToExist,
  withServerInfo
);

innerRoutes.post("/start", requireNoActions, dropletsController.onStartRequest);
innerRoutes.post(
  "/stop",
  requireDroplet,
  requireNoActions,
  dropletsController.onStopRequest
);
innerRoutes.post(
  "/save",
  requireDroplet,
  requireNoActions,
  dropletsController.onSaveRequest
);
innerRoutes.get("/ip", requireDroplet, dropletsController.onIPRequest);
innerRoutes.get(
  "/status",
  requiresServerToExist,
  dropletsController.onStatusRequest
);

export default routes;
