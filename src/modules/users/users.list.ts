import { prisma } from "../../database/prisma/client.js";
import { Role } from "@prisma/client";

export const getStaff = async (user: any) => {
  if (user.role !== Role.LEAD_PASTOR) {
    throw new Error("Only pastors can view staff");
  }

  return prisma.user.findMany({
    where: {
      churchId: user.churchId,
      role: Role.STAFF
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};