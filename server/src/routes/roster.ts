import { Router } from "express";
import {
  uploadRoster,
  getRosters,
  updateRoster,
  deleteRoster,
} from "../controllers/rosterController";

const router = Router();
router.post("/", uploadRoster);
router.get("/", getRosters);
router.put("/:id", updateRoster);
router.delete("/:id", deleteRoster);

export default router;
