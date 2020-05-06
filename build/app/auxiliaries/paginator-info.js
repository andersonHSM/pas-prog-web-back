"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginatorParams(req) {
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : 10;
    const paginatorInfo = {
        limit,
        page,
    };
    return paginatorInfo;
}
exports.paginatorParams = paginatorParams;
