import { prisma } from "../../database/prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email }, });
    if (!user)
        throw new Error("Invalid credentials");
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jwt.sign({
        userId: user.id,
        role: user.role,
        churchId: user.churchId
    }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};
