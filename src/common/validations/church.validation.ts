import { z } from "zod";

export const createChurchSchema = z.object({
    name: z.string().min(2, "Church name is required"),
    email: z.string().email(),
    type: z.enum(["NATIONAL", "REGIONAL", "LOCAL"]),
    parentId: z.string().uuid().optional(),
    pastorEmail: z.string().email(),
    pastorPassword: z.string().min(6)
});