export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (err) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: err.errors
            });
        }
    };
};
