import { prisma } from "../../database/prisma/client.js";
export const logAction = async ({ userId, action, entity, entityId, metadata }) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                metadata
            }
        });
    }
    catch (err) {
        console.error("Audit log failed:", err);
    }
};
