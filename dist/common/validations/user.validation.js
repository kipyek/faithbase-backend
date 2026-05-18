import { z } from "zod";
export const createStaffSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
