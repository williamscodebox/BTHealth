import express from "express";
import type { Router } from "express";
import protectRoute from "../middleware/auth.middleware";

const router: Router = express.Router();

//router.post("/", protectRoute, createBPStat);
//router.get("/", protectRoute, getBPStats);
//router.delete("/:id", protectRoute, deleteBPStat);

export default router;
