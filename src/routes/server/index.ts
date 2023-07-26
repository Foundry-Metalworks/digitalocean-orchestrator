import express from "express";
import { body, param } from "express-validator";
import serverController from "@/controllers/server";
import validate from "@/middleware/validate";
import { requiresRole } from "@/middleware/permission";
import { ROLES } from "@/types";
import {
  requiresServerToExist,
  requiresServerToNotExist,
} from "@/middleware/server";
import {
  requiresUserAuthorized,
  requiresUserInServer,
} from "@/middleware/user";

const routes = express.Router();

routes.get(
  "/:serverId",
  param("serverId").isAlpha(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  serverController.onServerGet
);
routes.get(
  "/:serverId/check",
  param("serverId").isAlpha(),
  validate,
  serverController.onServerCheck
);
// Server must exist
routes.get(
  "/:serverId/token",
  param("serverId").isAlpha(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  requiresRole(ROLES.OWNER),
  serverController.onTokenGet
);
// Server must exist
routes.get(
  "/:serverId/link",
  param("serverId").isAlpha(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  requiresRole(ROLES.OWNER),
  serverController.onLinkGet
);
routes.post(
  "/create",
  body("serverId").isAlpha(),
  validate,
  requiresServerToNotExist,
  requiresUserAuthorized,
  serverController.onServerCreate
);
routes.post(
  "/join",
  body("inviteToken").isString().isAlphanumeric().isLength({ min: 8, max: 8 }),
  validate,
  serverController.onServerJoin
);

export default routes;
