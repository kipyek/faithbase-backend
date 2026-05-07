import { getAuditLogs } from "../modules/logs/logs.service.js";

export const getAuditLogsHandler = async (req: any, res: any, next: any) => {
  try {
    const result = await getAuditLogs(req.query);

    res.json({
      status: "success",
      data: result.logs,
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