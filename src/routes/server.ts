import express from "express";
import { body } from "express-validator";
import { validationHelper } from "../util/controller";
import serverController from "../controllers/server";

const routes = express.Router();

routes.get(
  "/:name/exists",
  body("name").isString(),
  serverController.checkServerExists
);
routes.post(
  "/",
  body("name").isString(),
  body("doToken").isString(),
  validationHelper,
  serverController.setServerInfo
);

export default routes;
