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
const sequelize_1 = require("sequelize");
const index_1 = require("../../database/index");
const bcrypt_1 = require("bcrypt");
const Locations_1 = __importDefault(require("./Locations"));
class Users extends sequelize_1.Model {
    checkPassword(password) {
        return bcrypt_1.compare(password, this.password_hash);
    }
}
Users.init({
    name: sequelize_1.DataTypes.STRING(100),
    email: sequelize_1.DataTypes.STRING(50),
    password: sequelize_1.DataTypes.VIRTUAL,
    password_hash: sequelize_1.DataTypes.STRING(36),
}, { sequelize: index_1.sequelize, tableName: 'Users' });
Users.addHook('beforeSave', (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.password) {
        user.password_hash = yield bcrypt_1.hash(user.password, 10);
    }
}));
Users.hasMany(Locations_1.default, {
    sourceKey: 'id',
    foreignKey: 'user_id',
    as: 'locations',
});
exports.default = Users;
