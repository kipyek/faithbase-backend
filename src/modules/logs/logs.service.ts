import { getPagination } from "../../common/utils/pagination.js";
import { prisma } from "../../database/prisma/client.js";

export const getAuditLogs = async (query: any) => {
    const { page, limit } = getPagination(query);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        }),
        prisma.auditLog.count()
    ]);

    return { logs, total, page, limit };
};