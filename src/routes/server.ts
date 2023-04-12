import express from "express";
import { body, param } from "express-validator";
import serverController from "../controllers/server";
import validate from "../middleware/validate";

const routes = express.Router();

routes.get("/", serverController.onServerGet);
routes.get("/token", serverController.onTokenGet);
routes.get(
  "/:name/exists",
  param("name").isString(),
  validate,
  serverController.onCheckForServer
);
routes.post(
  "/create",
  body("name").isString(),
  body("doApiToken").isString(),
  validate,
  serverController.onServerCreate
);
routes.post(
  "/join",
  body("inviteToken").isString().isAlphanumeric().isLength({ min: 8, max: 8 }),
  validate,
  serverController.onServerJoin
);

export default routes;
