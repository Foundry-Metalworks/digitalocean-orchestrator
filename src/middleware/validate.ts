import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { MiddlewareError } from "../types";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return next(
    new MiddlewareError(400, `Input failed validation`, errors.array())
  );
};

export default validate;
