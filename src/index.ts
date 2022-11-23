import express  from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

const router = express.Router();

app.use(cors());
app.disable("etag");
app.use("/api", router);
app.listen(3100, () => {
  console.log(
      `[server]: digitalocean-orchestrator is running at http://localhost:${3100}`
  );
});

export default app;
