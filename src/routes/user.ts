import express from "express";
import userController from "../controllers/user";

const routes = express.Router();

routes.get("/me", userController.onUserGet);

export default routes;
