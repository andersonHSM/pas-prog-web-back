"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const auth_1 = require("../../config/auth");
const JwtBlacklist_1 = __importDefault(require("../models/JwtBlacklist"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ error: 'Token not provided.' });
        }
        const [, token] = authHeader.split(' ');
        const blacklistedToken = yield JwtBlacklist_1.default.findOne({
            where: { token },
            attributes: ['id', 'token'],
        });
        if (blacklistedToken) {
            return res
                .status(401)
                .json({ error: 'Provided token is no longer valid.' });
        }
        try {
            const decoded = yield util_1.promisify(jsonwebtoken_1.default.verify)(token, auth_1.tokenSecurityKey);
            req.userId = decoded.id;
            return next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    });
}
exports.authMiddleware = authMiddleware;
