"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_json_1 = __importDefault(require("../config/database.json"));
class Database {
    constructor() {
        this.sequelize = new sequelize_1.Sequelize(database_json_1.default['development']);
    }
}
exports.Database = Database;
exports.sequelize = new Database().sequelize;
