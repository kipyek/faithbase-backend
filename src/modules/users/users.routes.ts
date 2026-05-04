import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createStaffHandler } from "../../controller/users.js";
import { getStaffHandler } from "../../controller/staffs.js";
import { createStaffSchema } from "../../common/validations/user.validation.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { authorizeRoles } from "../../common/middleware/role.middleware.js";

const router = Router();

// 🧑‍⚕️ Create Staff (Pastor only)
router.post("/", authMiddleware, validate(createStaffSchema), createStaffHandler);
router.get("/", authMiddleware, authorizeRoles("STAFF"), getStaffHandler);

export default router;