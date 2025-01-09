import { Router } from "express";
import {
  createRequest,
  getRequests,
} from "@/server/controllers/requestControllers";

const router = Router();

router.route("/request").put(createRequest);
router.route("/request").get(getRequests);

export default router;
