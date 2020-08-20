"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const LocationController_1 = __importDefault(require("./app/controllers/LocationController"));
const SessionController_1 = require("./app/controllers/SessionController");
const AuthMiddleware_1 = require("./app/middlewares/AuthMiddleware");
const JwtBlacklistController_1 = require("./app/controllers/JwtBlacklistController");
const routes = express_1.Router();
exports.routes = routes;
routes.post('/users/', UserController_1.default.store);
routes.post('/login/', SessionController_1.sessionController.store);
routes.get('/locations/', LocationController_1.default.index);
routes.use(AuthMiddleware_1.authMiddleware);
routes.post('/logout/', JwtBlacklistController_1.jwtBlacklistController.create);
routes.get('/user/:id/locations/', LocationController_1.default.listLocaleByUser);
routes.post('/locations/', LocationController_1.default.store);
routes.patch('/locations/:id/', LocationController_1.default.update);
routes.delete('/locations/:id/', LocationController_1.default.delete);