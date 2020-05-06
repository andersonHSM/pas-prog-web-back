"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../../database/index");
class JwtBlacklist extends sequelize_1.Model {
}
JwtBlacklist.init({
    token: sequelize_1.DataTypes.STRING,
}, { sequelize: index_1.sequelize, tableName: 'jwt_blacklist' });
exports.default = JwtBlacklist;
