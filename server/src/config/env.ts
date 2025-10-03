import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  JWT_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
  CORS_ORIGIN: z.string().optional(),
}).nonstrict();

const env = envSchema.parse(process.env);
export default env;
