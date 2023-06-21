import express from "express";
import userController from "../controllers/user";
import { body } from "express-validator";
import validate from "../middleware/validate";

const routes = express.Router();

routes.get("/me", userController.onUserGet);
routes.post(
  "/authorize",
  body("code").isString(),
  validate,
  userController.onUserAuthorize
);

export default routes;
