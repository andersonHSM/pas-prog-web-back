"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
require("./database/index");
const routes_1 = require("./routes");
class App {
    constructor() {
        this._server = express_1.default();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this._server.use(express_1.default.json());
        this._server.use('/files/', express_1.default.static(path_1.default.resolve(__dirname, '..', 'temp', 'uploads')));
        this._server.use(cors_1.default({ origin: true, credentials: true }));
    }
    routes() {
        this._server.use(routes_1.routes);
    }
    get server() {
        return this._server;
    }
}
exports.server = new App().server;
