import express, { NextFunction, Request } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import doRoutes from "./routes/instance";
import serverRoutes from "./routes/server";
import userRoutes from "./routes/user";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as process from "process";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;
const isDevelopment = process.env.NODE_ENV == "development";

// cors
app.use(
  cors({
    origin: isDevelopment
      ? "http://localhost:3000"
      : `https://${process.env.DOMAIN_NAME}`,
  })
);

// auth
app.use(ClerkExpressRequireAuth());

// data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/instance", doRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/user", userRoutes);

app.disable("etag");
app.listen(PORT, () => {
  console.log(`[server]: metalworks-orchestrator is running at port ${PORT}`);
});

export default app;
