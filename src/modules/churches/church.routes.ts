import { Router } from "express";
import { createChurchHandler } from "../../controller/church.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createChurchSchema } from "../../common/validations/church.validation.js";
import { validate } from "../../common/middleware/validate.middleware.js";

const router = Router();

router.post("/", authMiddleware, validate(createChurchSchema), createChurchHandler);

export default router;