import express  from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import dropletsController from './controllers/droplets';
dotenv.config();

const app = express();

const router = express.Router();
router.post('/start', dropletsController.onStartRequest);
router.post('/stop', dropletsController.onStopRequest);
router.get('/status', dropletsController.onStatusRequest);

app.use(cors());
app.disable("etag");
app.use("/api", router);
app.listen(3100, () => {
  console.log(
      `[server]: digitalocean-orchestrator is running at http://localhost:${3100}`
  );
});

export default app;
