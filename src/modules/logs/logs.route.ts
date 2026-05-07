import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { authorizeRoles } from "../../common/middleware/role.middleware.js";
import { getAuditLogsHandler } from "../../controller/logs.js";

const router = Router();
router.get(
    "/",
    authMiddleware,
    authorizeRoles("SUPER_ADMIN", "LEAD_PASTOR"),
    getAuditLogsHandler
);

export default router;