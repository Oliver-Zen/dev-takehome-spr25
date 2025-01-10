import { Router } from "express";
import {
  createRequest,
  getRequests,
  updateRequest,
} from "@/server/controllers/requestControllers";

const router = Router();

router.route("/request").put(createRequest);
router.route("/request").get(getRequests);
router.route("/request").patch(updateRequest);

export default router;
