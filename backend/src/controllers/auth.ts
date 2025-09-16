import { Request, Response } from "express";
import { signinBody, signupBody } from "../utils/zod";
import { signupService } from "../services/signup";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { signinService } from "../services/signin";

export default async function signupController(req: Request, res: Response) {
  const parsedBody = signupBody.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedBody.error.flatten(),
    });
  }

  const { name, email, password } = parsedBody.data;

  try {
    const newUser = await signupService(name, email, password);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
}


export async function signinController(req: Request, res: Response) {
  const parsedBody = signinBody.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedBody.error.flatten(),
    });
  }

  const { email, password } = parsedBody.data;

  try {
    const user = await signinService(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
}

export async function logoutController() {}

