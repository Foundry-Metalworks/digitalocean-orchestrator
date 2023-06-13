import express from "express";
import { body, param } from "express-validator";
import serverController from "../controllers/server";
import validate from "../middleware/validate";
import { requiresNewUser, requiresSetupUser } from "../middleware/user";

const routes = express.Router();

routes.get("/", serverController.onServerGet);
routes.get("/token", requiresSetupUser, serverController.onTokenGet);
routes.get("/link", requiresSetupUser, serverController.onLinkGet);
routes.get(
  "/:name/exists",
  param("name").isAlpha(),
  validate,
  serverController.onCheckForServer
);
routes.post(
  "/create",
  body("name").isAlpha(),
  body("doApiToken").isString(),
  validate,
  requiresNewUser,
  serverController.onServerCreate
);
routes.post(
  "/join",
  body("inviteToken").isString().isAlphanumeric().isLength({ min: 8, max: 8 }),
  validate,
  requiresNewUser,
  serverController.onServerJoin
);
routes.post(
  "/invite",
  body("email").isEmail(),
  validate,
  requiresSetupUser,
  serverController.onServerInvite
);

export default routes;
