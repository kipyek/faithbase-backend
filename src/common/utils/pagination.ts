type PaginationQuery = {
    page?: number;
    limit?: number;
};

export const getPagination = (query: any): Required<PaginationQuery> => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 100); // cap at 100

    return { page, limit };
};

export const getPagingData = (
    total: number,
    page: number,
    limit: number
) => {
    const totalPages = Math.ceil(total / limit);

    return {
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    };
};