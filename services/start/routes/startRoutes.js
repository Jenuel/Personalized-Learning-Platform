import express from "express";
import { getDueCards, getAllCards, handleCards } from "../controllers/startController.js";

const router = express.Router();

router.get("/due", getDueCards);

router.get("/all", getAllCards);

router.put("/update", handleCards);

export default router;