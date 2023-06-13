import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import dropletRoutes from "./routes/droplets";
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
app.use(
  ClerkExpressRequireAuth({
    onError: (err) => {
      err.status = 401;
      return err;
    },
  })
);

// data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/instance", dropletRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/user", userRoutes);

//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("err:\n" + err.stack);
  if (res.headersSent) {
    return next(err);
  }
  if (err.message == "Unauthenticated") res.status(401);
  else res.status(500);
  res.send({ error: { message: err.message, stack: err.stack } });
});

// start
app.disable("etag");
app.listen(PORT, () => {
  console.log(`[server]: metalworks-orchestrator is running at port ${PORT}`);
});

export default app;
