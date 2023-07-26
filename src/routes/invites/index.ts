import express from "express";
import { body, param } from "express-validator";
import validate from "@/middleware/validate";
import { requiresRole } from "@/middleware/permission";
import { ROLES } from "@/types";
import invitesController from "@/controllers/invites";
import { requiresServerToExist } from "@/middleware/server";
import { requiresUserInServer } from "@/middleware/user";

const routes = express.Router();

routes.get("/", invitesController.onInvitesGetForUser);
routes.post(
  "/create",
  body("serverId").isAlpha(),
  body("email").isEmail(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  requiresRole(ROLES.OWNER),
  invitesController.onInviteCreate
);
routes.post(
  "/accept",
  body("inviteId").isNumeric(),
  validate,
  invitesController.onInviteAccept
);
routes.get(
  "/:serverId",
  param("serverId").isAlpha(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  requiresRole(ROLES.OWNER),
  invitesController.onInvitesGetForServer
);
routes.delete(
  "/:serverId/:inviteId",
  param("serverId").isAlpha(),
  param("inviteId").isNumeric(),
  validate,
  requiresServerToExist,
  requiresUserInServer,
  requiresRole(ROLES.OWNER),
  invitesController.onInviteRemove
);

export default routes;
