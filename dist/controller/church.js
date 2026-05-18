import { createChurch } from "../modules/churches/church.service.js";
export const createChurchHandler = async (req, res, next) => {
    try {
        const church = await createChurch(req.user, req.body);
        res.json({
            status: "success",
            message: "Church created successfully",
            data: church
        });
    }
    catch (err) {
        next(err);
    }
};
