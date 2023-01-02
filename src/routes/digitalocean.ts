import express from "express";
import dropletsController from "../controllers/droplets";
import snapshotsController from "../controllers/snapshots";
import networkController from "../controllers/network";

const routes = express.Router();

routes.post("/:domainName/start", dropletsController.onStartRequest);
routes.post("/:domainName/stop", dropletsController.onStopRequest);
routes.post("/:domainName/save", snapshotsController.onSaveRequest);
routes.get("/:domainName/status", dropletsController.onStatusRequest);
routes.get("/:domainName/ip", dropletsController.onIPRequest);
routes.get("/:domainName", networkController.onNameRequest);

export default routes;
