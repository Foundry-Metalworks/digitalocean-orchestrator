import express from "express";
import dropletsController from "../controllers/droplets";
import snapshotsController from "../controllers/snapshots";
import * as dotenv from "dotenv";

dotenv.config();

const routes = express.Router();
routes.post("/start", dropletsController.onStartRequest);
routes.post("/stop", dropletsController.onStopRequest);
routes.post("/save", snapshotsController.onSaveRequest);
routes.get("/status", dropletsController.onStatusRequest);
routes.get("/ip", dropletsController.onIPRequest);

export default routes;
