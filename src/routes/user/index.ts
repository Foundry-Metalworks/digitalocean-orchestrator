import express from "express";
import userController from "@/controllers/user";
import { body } from "express-validator";
import validate from "@/middleware/validate";
import { requiresUserAuthorized } from "@/middleware/user";

const routes = express.Router();

routes.get("/me", userController.onUserGet);
routes.post(
  "/authorize",
  body("code").isString(),
  validate,
  userController.onUserAuthorize
);
routes.delete(
  "/authorize",
  requiresUserAuthorized,
  userController.onUserUnauthorize
);

export default routes;
