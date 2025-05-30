import express from "express";
import { getDueCards, getAllCards } from "../controllers/startController.js";

router = express.Router();

router.get("/due", getDueCards);

router.get("/all", getAllCards);


export default router;