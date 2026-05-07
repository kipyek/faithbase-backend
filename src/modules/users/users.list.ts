import { Role } from "@prisma/client";
import { prisma } from "../../database/prisma/client.js";
import { getPagination } from "../../common/utils/pagination.js";

export const getStaff = async (user: any, query: any) => {
  const { page, limit } = getPagination(query);

  const skip = (page - 1) * limit;

  const [staff, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        churchId: user.churchId,
        role: Role.STAFF
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.user.count({
      where: {
        churchId: user.churchId,
        role: Role.STAFF
      }
    })
  ]);

  return {
    staff,
    total,
    page,
    limit
  };
};