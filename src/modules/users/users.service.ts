import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { prisma } from "../../database/prisma/client.js";

export const createStaff = async (user: any, data: any) => {
    const { email, password } = data;

    // 🔎 Check duplicate email
    const existing = await prisma.user.findUnique({
        where: { email }
    });

    if (existing) {
        throw new Error("User already exists");
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create staff in SAME church
    const staff = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: Role.STAFF,
            churchId: user.churchId
        }
    });

    return staff;
};