import express from "express";
import { body, param } from "express-validator";
import validate from "../middleware/validate";
import { requiresRole } from "../middleware/permission";
import { ROLES } from "../types";
import invitesController from "../controllers/invites";

const routes = express.Router();

routes.get("/", invitesController.onInvitesGetForUser);
routes.post(
  "/create",
  body("serverId").isAlpha(),
  body("email").isEmail(),
  validate,
  requiresRole(ROLES.ADMIN),
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
  requiresRole(ROLES.ADMIN),
  invitesController.onInvitesGetForServer
);
routes.delete(
  "/:serverId/:inviteId",
  param("serverId").isAlpha(),
  param("inviteId").isNumeric(),
  validate,
  requiresRole(ROLES.ADMIN),
  invitesController.onInviteRemove
);

export default routes;
