import express from "express";
import { getSearchHistory, removeItemFromSearchHistory, searchMovie, searchPerson, searchTv } from "../controllers/search.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/person/:query",protectRoute,searchPerson);
router.get("/movie/:query",protectRoute,searchMovie);
router.get("/tv/:query",protectRoute,searchTv);

router.get("/history",getSearchHistory)
router.delete("/history/:id",removeItemFromSearchHistory)

export default router;