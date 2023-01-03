import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import doRoutes from "./routes/digitalocean";
import serverRoutes from "./routes/server";
import userRoutes from "./routes/user";
import { auth } from "express-oauth2-jwt-bearer";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;
const isDevelopment = process.env.NODE_ENV == "development";

// cors
app.use(
  cors({
    origin: isDevelopment ? "http://127.0.0.1:5173" : "https://dnd.t2pellet.me",
  })
);
app.use(
  auth({
    audience: process.env.URL,
    issuerBaseURL: process.env.CLIENT_DOMAIN,
  })
);
app.use(express.json());

app.use("/api/instance", doRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/user", userRoutes);

app.disable("etag");
app.listen(PORT, () => {
  console.log(`[server]: metalworks-orchestrator is running at port ${PORT}`);
});

export default app;
