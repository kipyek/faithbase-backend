import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "./client.js";
async function main() {
    const existing = await prisma.user.findFirst({
        where: { role: Role.SUPER_ADMIN }
    });
    if (existing) {
        console.log("Super admin already exists");
        return;
    }
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    await prisma.user.create({
        data: {
            email: "admin@faithbase.com",
            password: hashedPassword,
            role: Role.SUPER_ADMIN
        }
    });
    console.log("✅ Super admin created");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
