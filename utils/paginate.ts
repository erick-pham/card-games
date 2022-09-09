export const paginateResponse = (data: any, page: number, limit: number) => {
  const [result, total] = data;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    data: [...result],
    count: total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
    limit: limit,
  };
};

export const paginateRequest = (req: any) => {
  const take = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * take;
  const keyword = req.query.keyword || "";
  return {
    take,
    page,
    skip,
    keyword,
  };
};
