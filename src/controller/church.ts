import { Request, Response, NextFunction } from "express";
import { createChurch } from "../modules/churches/church.service.js";

export const createChurchHandler = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const church = await createChurch(req.user, req.body);

        res.json({
            status: "success",
            message: "Church created successfully",
            data: church
        });
    } catch (err) {
        next(err);
    }
};