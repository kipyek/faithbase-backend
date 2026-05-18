import bcrypt from "bcrypt";
import pkg from "@prisma/client";
import type { Role as PrismaRole, ChurchType as PrismaChurchType } from "@prisma/client";
import { prisma } from "../../database/prisma/client.js";

const { Role, ChurchType } = pkg as { Role: typeof PrismaRole; ChurchType: typeof PrismaChurchType };

export const createChurch = async (user: any, data: any) => {
  let { name, email, type, parentId, pastorEmail, pastorPassword } = data;

  let parentChurch = null;

  if (parentId) {
    parentChurch = await prisma.church.findUnique({
      where: { id: parentId }
    });

    if (!parentChurch) throw new Error("Parent church not found");
  }

  // =========================
  // SUPER ADMIN RULES
  // =========================
  if (user.role === Role.SUPER_ADMIN) {
    if (type === ChurchType.NATIONAL) {
      parentId = null;
    }

    if (type === ChurchType.REGIONAL) {
      if (!parentChurch || parentChurch.type !== ChurchType.NATIONAL) {
        throw new Error("Regional must have a NATIONAL parent");
      }
    }

    if (type === ChurchType.LOCAL) {
      if (!parentChurch || parentChurch.type !== ChurchType.REGIONAL) {
        throw new Error("Local must have a REGIONAL parent");
      }
    }
  }

  // =========================
  // LEAD PASTOR RULES
  // =========================
  else if (user.role === Role.LEAD_PASTOR) {
    const userChurch = await prisma.church.findUnique({
      where: { id: user.churchId }
    });

    if (!userChurch) throw new Error("User church not found");

    if (userChurch.type === ChurchType.NATIONAL) {
      if (type !== ChurchType.REGIONAL) {
        throw new Error("National can only create Regional");
      }
      parentId = userChurch.id;
    }

    else if (userChurch.type === ChurchType.REGIONAL) {
      if (type !== ChurchType.LOCAL) {
        throw new Error("Regional can only create Local");
      }
      parentId = userChurch.id;
    }

    else {
      throw new Error("Local cannot create churches");
    }
  }

  else {
    throw new Error("Unauthorized");
  }

  // =========================
  // Create Church
  // =========================
  const church = await prisma.church.create({
    data: {
      name,
      email,
      type,
      parentId
    }
  });

  // =========================
  // Create Lead Pastor
  // =========================
  const hashedPassword = await bcrypt.hash(pastorPassword, 10);

  await prisma.user.create({
    data: {
      email: pastorEmail,
      password: hashedPassword,
      role: Role.LEAD_PASTOR,
      churchId: church.id
    }
  });

  return church;
};