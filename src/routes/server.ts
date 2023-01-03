import express from "express";
import { body, param } from "express-validator";
import { validationHelper } from "../util/controller";
import serverController from "../controllers/server";

const routes = express.Router();

routes.get(
  ":name",
  param("name").isString(),
  validationHelper,
  serverController.getServerTokens
);
routes.post(
  "/",
  body("name").exists(),
  body("doToken").exists(),
  validationHelper,
  serverController.setServerTokens
);
routes.get(
  "/user/:email/exists",
  param("email").isEmail(),
  validationHelper,
  serverController.userHasServer
);
routes.get(
  "/user/:email",
  param("email").isEmail(),
  validationHelper,
  serverController.getUserServer
);
routes.post(
  "/user",
  body("email").isEmail(),
  body("server").isString(),
  validationHelper,
  serverController.setUserServer
);

export default routes;
