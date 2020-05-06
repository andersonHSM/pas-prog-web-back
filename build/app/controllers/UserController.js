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
const User_1 = __importDefault(require("../models/User"));
class UserController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const previousUser = yield User_1.default.findOne({
                where: { email: req.body.email },
            });
            if (previousUser) {
                console.log(yield previousUser.checkPassword(req.body.password));
                return res.status(401).json({ error: 'User already exists' });
            }
            const user = yield User_1.default.create(req.body);
            if (!user) {
                return res.status(400).json({ error: 'Unable to create user' });
            }
            const { id, name, email } = user;
            return res.status(200).json({ user: { id, name, email } });
        });
    }
}
exports.default = new UserController();
