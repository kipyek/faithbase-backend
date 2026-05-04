import { Response, NextFunction } from "express";
import { getStaff } from "../modules/users/users.list.js";

export const getStaffHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const staff = await getStaff(req.user);

    res.json({
      status: "success",
      message: "Staff retrieved successfully",
      data: staff
    });
  } catch (err) {
    next(err);
  }
};