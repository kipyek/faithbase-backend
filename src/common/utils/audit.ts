import { prisma } from "../../database/prisma/client.js";


export const logAction = async ({
    userId,
    action,
    entity,
    entityId,
    metadata
}: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    metadata?: any;
}) => {
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
    } catch (err) {
        console.error("Audit log failed:", err);
    }
};