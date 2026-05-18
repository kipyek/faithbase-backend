import { Router } from "express";
import { validateC2B, confirmC2B } from "../../controller/mpesa.js";
const router = Router();
// 💸 Safaricom C2B Webhooks
router.post("/validation", validateC2B);
router.post("/confirmation", confirmC2B);
export default router;
