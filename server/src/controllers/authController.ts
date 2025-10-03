import { Request, Response } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { token, refreshToken, user } = await authService.login(req.body.email, req.body.password);
    res.json({ token, refreshToken, user });
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { token, refreshToken } = await authService.refreshToken(req.body.refreshToken);
    res.json({ token, refreshToken });
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
}

export async function logout(req: Request, res: Response) {
  // JWT 기반 인증에서는 서버에서 특별히 할 작업이 없으므로 204 응답만 반환합니다.
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const user = await authService.getUserFromToken(token);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
}
