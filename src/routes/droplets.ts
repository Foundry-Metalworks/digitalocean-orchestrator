import express from "express";
import dropletsController from "../controllers/droplets";
import * as dotenv from "dotenv";
import {
  requireDroplet,
  requireNoActions,
  withServerInfo,
} from "../middleware/droplets";

dotenv.config();

const routes = express.Router();
routes.use(withServerInfo);

routes.post("/start", requireNoActions, dropletsController.onStartRequest);
routes.post(
  "/stop",
  requireDroplet,
  requireNoActions,
  dropletsController.onStopRequest
);
routes.post(
  "/save",
  requireDroplet,
  requireNoActions,
  dropletsController.onSaveRequest
);
routes.get("/ip", requireDroplet, dropletsController.onIPRequest);
routes.get("/status", dropletsController.onStatusRequest);

export default routes;
