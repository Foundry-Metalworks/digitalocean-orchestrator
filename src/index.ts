import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import doRoutes from "./routes/digitalocean";
import serverRoutes from "./routes/server";
import routes from "./routes/digitalocean";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// cors
app.use(cors({ origin: ["http://127.0.0.1:5173", "https://dnd.t2pellet.me"] }));
routes.use(express.json());

app.use("/api/instance", doRoutes);
app.use("/api/servers", serverRoutes);

app.disable("etag");
app.listen(PORT, () => {
  console.log(`[server]: metalworks-orchestrator is running at port ${PORT}`);
});

export default app;
