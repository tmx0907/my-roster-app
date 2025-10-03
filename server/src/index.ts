import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import rosterRoutes from "./routes/roster";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/roster", rosterRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
