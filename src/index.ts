import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import { expressJwtSecret, GetVerificationKey } from "jwks-rsa";
import doRoutes from "./routes/digitalocean";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

const jwtCheck = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://metalworks.us.auth0.com/.well-known/jwks.json",
  }) as GetVerificationKey,
  audience: "https://dnd-orchestrator.t2pellet.me",
  issuer: "https://metalworks.us.auth0.com",
  algorithms: ["RS256"],
});

app.use(jwtCheck);
app.use("/api", doRoutes);

app.use(cors());
app.disable("etag");
app.listen(PORT, () => {
  console.log(`[server]: metalworks-orchestrator is running at port ${PORT}`);
});

export default app;
