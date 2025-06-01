import express from "express";
import { getDueCards, getAllCards, updateCardsStatus } from "../controllers/startController.js";

router = express.Router();

router.get("/due", getDueCards);

router.get("/all", getAllCards);

router.patch("/update", updateCardsStatus);

export default router;