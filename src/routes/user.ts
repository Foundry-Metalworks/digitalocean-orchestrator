import { body } from "express-validator";
import serverController from "../controllers/user";
import express from "express";
import validate from "../middleware/validate";

const routes = express.Router();

routes.get("/setup", serverController.onCheckUserSetup);
routes.get("/", serverController.onGetUserServer);
routes.post(
  "/",
  body("server").isString(),
  validate,
  serverController.onSetUserServer
);

export default routes;
