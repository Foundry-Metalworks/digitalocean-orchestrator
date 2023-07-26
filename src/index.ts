import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import dropletRoutes from "./routes/droplets";
import serverRoutes from "./routes/server";
import userRoutes from "./routes/user";
import inviteRoutes from "./routes/invites";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as process from "process";
import { DOData, MiddlewareError } from "./types";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./swagger";

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    droplet?: DOData;
  }
}

const app = express();
const PORT = process.env.PORT || 3030;
const isDevelopment = process.env.NODE_ENV == "development";

// swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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
app.use("/api/servers", serverRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invites", inviteRoutes);

//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("err:\n" + err.stack);
  if (res.headersSent) {
    return next(err);
  }
  if (err.message == "Unauthenticated") res.status(401);
  else if (err instanceof MiddlewareError) {
    const mErr = err as MiddlewareError;
    res.status(mErr.statusCode);
  } else res.status(500);
  res.send({ error: { message: err.message, stack: err.stack } });
});

// start
app.disable("etag");
app.listen(PORT, () => {
  console.log(`[server]: metalworks-orchestrator is running at port ${PORT}`);
});

export default app;
