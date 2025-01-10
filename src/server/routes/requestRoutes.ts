import { Router } from "express";
import {
  batchDeleteRequests,
  batchEditRequests,
  createRequest,
  getRequests,
  updateRequest,
} from "@/server/controllers/requestControllers";

const router = Router();

router.route("/request").put(createRequest);
router.route("/request").get(getRequests);
router.route("/request").patch(updateRequest);
router.route("/requests/edit").patch(batchEditRequests);
router.route("/requests").delete(batchDeleteRequests);

export default router;
