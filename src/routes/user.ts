import { body } from "express-validator";
import { validationHelper } from "../util/controller";
import serverController from "../controllers/user";
import express from "express";

const routes = express.Router();

routes.get("/setup", serverController.isUserSetup);
routes.get("/", serverController.getUserServer);
routes.post(
  "/",
  body("server").isString(),
  validationHelper,
  serverController.setUserServer
);

export default routes;
