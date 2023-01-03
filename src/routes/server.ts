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
  body("name").isString(),
  body("doToken").isString(),
  validationHelper,
  serverController.setServerTokens
);

export default routes;
