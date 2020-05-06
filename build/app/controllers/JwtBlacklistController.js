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
const JwtBlacklist_1 = __importDefault(require("../models/JwtBlacklist"));
class JwtBlacklistController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const [, token] = authHeader.split(' ');
            const existintToken = yield JwtBlacklist_1.default.findOne({ where: { token } });
            if (existintToken) {
                return res.status(400).json({ error: 'Already invalidated token.' });
            }
            const registredToken = yield JwtBlacklist_1.default.create({ token });
            return res.status(200).json({ sucess: 'Sucessfully logged out.' });
        });
    }
}
exports.jwtBlacklistController = new JwtBlacklistController();
