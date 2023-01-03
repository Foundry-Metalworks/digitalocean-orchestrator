import express from "express";
import dropletsController from "../controllers/droplets";
import snapshotsController from "../controllers/snapshots";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import * as dotenv from "dotenv";

dotenv.config();

const routes = express.Router({ mergeParams: true });
routes.use(
  auth({
    audience: process.env.URL,
    issuerBaseURL: `https://metalworks.us.auth0.com/`,
  })
);
routes.get("/", (req, res) => {
  res.send(200);
});
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

const instanceRouter = express.Router();
instanceRouter.use("/:server", routes);
export default instanceRouter;
