import express from "express";
import { getFaqs, getCategories } from "../controllers/faqController.js";

const router = express.Router();

// More specific route first, so "/categories" isn't ever confused
// with a dynamic parameter (not an issue here since we don't have
// one on this router, but it's a good habit).
router.get("/categories", getCategories);
router.get("/", getFaqs);

export default router;
