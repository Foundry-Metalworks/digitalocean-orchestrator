import express from "express";
import { body } from "express-validator";
import serverController from "../controllers/server";
import validate from "../middleware/validate";

const routes = express.Router();

routes.get(
  "/:name/exists",
  body("name").isString(),
  serverController.onServerCheck
);
routes.post(
  "/",
  body("name").isString(),
  body("doToken").isString(),
  validate,
  serverController.onServerSet
);

export default routes;
