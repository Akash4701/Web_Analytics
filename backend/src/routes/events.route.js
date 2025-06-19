import { Router } from "express";
import { getRecentEvents, createEvent,getTimeInterval,getTopEvents, getDashboardMetrics} from "../controllers/event.controller.js";

const router=Router();

router.post("/create",createEvent);
router.get("/dashboard",getDashboardMetrics)
router.get("/count",getTimeInterval)
router.get("/top",getTopEvents)
router.get("/recent",getRecentEvents)

export default router