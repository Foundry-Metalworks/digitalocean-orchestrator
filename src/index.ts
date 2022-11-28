import express  from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import dropletsController from './controllers/droplets';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

const router = express.Router();
router.post('/start', dropletsController.onStartRequest);
router.post('/stop', dropletsController.onStopRequest);
router.get('/status', dropletsController.onStatusRequest);
router.get('/ip', dropletsController.onIPRequest);

app.use(cors());
app.disable("etag");
app.use("/api", router);
app.listen(PORT, () => {
  console.log(
      `[server]: digitalocean-orchestrator is running at http://localhost:${PORT}`
  );
});

export default app;
