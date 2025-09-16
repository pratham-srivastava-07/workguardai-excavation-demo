import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors || err.message,
      });
    }
  };
