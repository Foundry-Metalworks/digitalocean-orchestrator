import express from "express";
import dropletsController from "../controllers/droplets";
import snapshotsController from "../controllers/snapshots";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import * as dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
routes.post(
  "/start",
  requiredScopes("admin"),
  dropletsController.onStartRequest
);
routes.post("/stop", requiredScopes("admin"), dropletsController.onStopRequest);
routes.post(
  "/save",
  requiredScopes("admin"),
  snapshotsController.onSaveRequest
);
routes.get("/status", dropletsController.onStatusRequest);
routes.get("/ip", dropletsController.onIPRequest);

export default routes;
