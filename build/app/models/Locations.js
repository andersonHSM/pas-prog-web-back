"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../database");
class Locations extends sequelize_1.Model {
}
Locations.init({
    name: sequelize_1.default.STRING,
    latitude: sequelize_1.default.FLOAT,
    longitude: sequelize_1.default.FLOAT,
    type: sequelize_1.default.STRING,
    adress: sequelize_1.default.STRING,
    active: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: true,
    },
    user_id: sequelize_1.default.NUMBER,
}, { sequelize: database_1.sequelize, tableName: 'Locations' });
exports.default = Locations;
