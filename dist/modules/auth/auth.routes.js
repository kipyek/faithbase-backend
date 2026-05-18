import { Router } from "express";
import { login } from "../../controller/login.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { loginSchema } from "../../common/validations/auth.validation.js";
const router = Router();
router.post("/login", validate(loginSchema), login);
export default router;
