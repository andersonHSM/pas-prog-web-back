import { Request } from 'express';

interface paginatorReturn {
  page: number;
  limit: number;
}

export function paginatorParams(req: Request) {
  const page = req.query.page ? +req.query.page : 1;
  const limit = req.query.limit ? +req.query.limit : 10;

  const paginatorInfo: paginatorReturn = {
    limit,
    page,
  };
  return paginatorInfo;
}
