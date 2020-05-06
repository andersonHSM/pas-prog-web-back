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
const joi_1 = __importDefault(require("@hapi/joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../../config/auth");
class SessionController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invalidUserError = { error: 'Invalid e-mail or password.' };
            const schema = joi_1.default.object({
                email: joi_1.default.string().required(),
                password: joi_1.default.string().pattern(new RegExp('^[\\w]{3,30}')).required(),
            });
            const { email, password } = req.body;
            try {
                yield schema.validateAsync({ email, password });
            }
            catch (error) {
                return res.status(400).json({ error: 'Please, verify inserted data.' });
            }
            const user = yield User_1.default.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json(invalidUserError);
            }
            if (user) {
                const passwordMatches = yield user.checkPassword(password);
                if (!passwordMatches) {
                    return res.status(401).json(invalidUserError);
                }
            }
            const { id, name } = user;
            const token = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.tokenSecurityKey, {
                expiresIn: auth_1.tokenExpirationTime,
            });
            return res.json({ id, name, email, token });
        });
    }
}
exports.sessionController = new SessionController();
