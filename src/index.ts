import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import dropletsController from "./controllers/droplets";
import snapshotsController from "./controllers/snapshots";
import networkController from "./controllers/network";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

const router = express.Router();
router.post("/:domainName/start", dropletsController.onStartRequest);
router.post("/:domainName/stop", dropletsController.onStopRequest);
router.post("/:domainName/save", snapshotsController.onSaveRequest);
router.get("/:domainName/status", dropletsController.onStatusRequest);
router.get("/:domainName/ip", dropletsController.onIPRequest);
router.get("/:domainName", networkController.onNameRequest);

app.use(cors());
app.disable("etag");
app.use("/api", router);
app.listen(PORT, () => {
  console.log(
    `[server]: digitalocean-orchestrator is running at http://localhost:${PORT}`
  );
});

export default app;
