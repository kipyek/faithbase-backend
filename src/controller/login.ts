import { Request, Response } from "express";
import { loginUser } from "../modules/auth/auth.service.js";



export const login = async (req: Request, res: Response) => {
    try {
        const data = await loginUser(req.body.email, req.body.password);
        res.json({ status: "success", data });
    } catch (err: any) {
        res.status(400).json({ status: "error", message: err.message });
    }
};