import { Response, NextFunction } from "express";
import { createStaff } from "../modules/users/users.service.js";

export const createStaffHandler = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const staff = await createStaff(req.user, req.body);

        res.json({
            status: "success",
            message: "Staff created successfully",
            data: staff
        });
    } catch (err) {
        next(err);
    }
};