import express from "express";
import userController from "../controllers/user";
import { body } from "express-validator";
import validate from "../middleware/validate";
import { requiresUserInvited } from "../middleware/user";

const routes = express.Router();

routes.get("/invites", userController.onInvitesGet);
routes.post(
  "/invites/accept",
  body("server"),
  validate,
  requiresUserInvited,
  userController.onInviteAccept
);

export default routes;
