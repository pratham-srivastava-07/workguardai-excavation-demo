import { Request, Response } from "express";
import { signinBody, signupBody } from "../utils/zod";
import { signupService } from "../services/signup";
import { signinService } from "../services/signin";
import { generateTokens, verifyRefreshToken } from "../utils/authUtils";

export default async function signupController(req: Request, res: Response) {
  const parsedBody = signupBody.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedBody.error.flatten(),
    });
  }

  const { name, email, password, role } = parsedBody.data;

  try {
    const { newUser, accessToken, refreshToken } = await signupService(
      name,
      email,
      password,
      role ?? "HOMEOWNER"
    );

    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      accessToken,
      refreshToken,
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
  console.log("REQUEST BODY", req.body);
  

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid request body",
      error: parsedBody.error.flatten(),
    });
  }

  const { email, password } = parsedBody.data;

  try {
    const result = await signinService(email, password);

    if (!result) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const { user, accessToken, refreshToken } = result;

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken,
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

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: 'Refresh token required' 
      });
    }

    // Verify refresh token
    const decoded: any = verifyRefreshToken(refreshToken) as { 
      id: string; 
      email: string 
    };
    
    // Generate new tokens
    const tokens = generateTokens({ 
      id: decoded.id, 
      email: decoded.email,
      role: decoded.role
    });

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid refresh token' 
    });
  }
};
