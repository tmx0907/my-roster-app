import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const users: User[] = []; // 예제에서는 메모리 저장소를 사용하지만 실제 서비스에서는 DB를 사용하세요.

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "change_this_secret_refresh";

export async function register(data: { email: string; password: string }): Promise<Omit<User, "passwordHash">> {
  const existing = users.find(u => u.email === data.email);
  if (existing) throw new Error("User already exists");

  // Argon2id로 비밀번호 해싱 (OWASP 권장 설정: 메모리 19MiB, 반복 2회 등:contentReference[oaicite:1]{index=1})
  const passwordHash = await argon2.hash(data.password, {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MiB
    timeCost: 2,
    parallelism: 1,
  });

  const user: User = { id: Date.now().toString(), email: data.email, passwordHash };
  users.push(user);
  return { id: user.id, email: user.email };
}

export async function login(email: string, password: string) {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Invalid email or password");

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) throw new Error("Invalid email or password");

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

  return { token, refreshToken, user: { id: user.id, email: user.email } };
}

export async function refreshToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as jwt.JwtPayload;
    const user = users.find(u => u.id === payload.sub);
    if (!user) throw new Error("Invalid refresh token");

    const newToken = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

    return { token: newToken, refreshToken: newRefreshToken };
  } catch {
    throw new Error("Invalid refresh token");
  }
}

export async function getUserFromToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const user = users.find(u => u.id === payload.sub);
    if (!user) throw new Error("Invalid token");
    return { id: user.id, email: user.email };
  } catch {
    throw new Error("Invalid token");
  }
}
