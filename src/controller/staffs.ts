import { Response, NextFunction } from "express";
import { getStaff } from "../modules/users/users.list.js";

export const getStaffHandler = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await getStaff(req.user, req.query);

    res.json({
      status: "success",
      message: "Staff retrieved successfully",
      data: result.staff,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (err) {
    next(err);
  }
};