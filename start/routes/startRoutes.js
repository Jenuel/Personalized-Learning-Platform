import express from "express";
import { getDueCards, getAllCards, updateCardStatus } from "../controllers/startController.js";

router = express.Router();

router.get("/due", getDueCards);

router.get("/all", getAllCards);

router.patch("/update/:id", updateCardStatus);

export default router;