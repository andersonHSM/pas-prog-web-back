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
const Locations_1 = __importDefault(require("../models/Locations"));
const paginator_info_1 = require("../auxiliaries/paginator-info");
class LocationController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                name: joi_1.default.string().min(3).max(60).required(),
                adress: joi_1.default.string().min(5).max(80).required(),
                latitude: joi_1.default.number().required(),
                longitude: joi_1.default.number().required(),
                type: joi_1.default.string().max(30).required(),
                user_id: joi_1.default.number().required(),
                active: joi_1.default.boolean(),
            });
            const { userId } = req;
            const locationData = Object.assign(Object.assign({}, req.body), { user_id: userId });
            try {
                const schemaMatchs = yield schema.validateAsync(locationData);
            }
            catch (error) {
                return res.status(400).json({ error: 'Verify inputed data.' });
            }
            const location = yield Locations_1.default.create(locationData);
            return res.json({ location });
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginator_info_1.paginatorParams(req);
            const { rows: locationsList, count: total, } = yield Locations_1.default.findAndCountAll({
                where: { active: true },
                offset: (page - 1) * limit,
                limit: limit,
                order: ['id'],
                attributes: ['id', 'name', 'type', 'longitude', 'latitude', 'adress'],
            });
            return res.status(200).json({ locationsList, total, pageSize: limit });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const locationUpdateSchema = joi_1.default.object({
                id: joi_1.default.number().required(),
                name: joi_1.default.string(),
                active: joi_1.default.boolean(),
                adress: joi_1.default.string(),
                latitude: joi_1.default.number(),
                longitude: joi_1.default.number(),
                type: joi_1.default.string(),
                userId: joi_1.default.number().required(),
            });
            const { userId } = req;
            try {
                yield locationUpdateSchema.validateAsync(Object.assign(Object.assign({ id }, req.body), { userId }));
            }
            catch (error) {
                return res.status(400).json({
                    error: 'Invalid location data inputed, please verify you fields.',
                });
            }
            const currentLocationData = yield Locations_1.default.findOne({ where: { id } });
            if (!currentLocationData) {
                return res.status(404).json({ error: 'Location not found.' });
            }
            const fieldToUpdate = Object.keys(req.body);
            const { user_id } = currentLocationData;
            if (userId !== user_id) {
                return res
                    .status(403)
                    .json({ error: 'You can only update your own locations.' });
            }
            const updateOptions = {
                where: { id },
                fields: fieldToUpdate,
            };
            yield Locations_1.default.update(req.body, updateOptions);
            const updatedLocation = yield Locations_1.default.findOne({ where: { id } });
            return res.json({ updatedLocation });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteSchema = joi_1.default.object({
                id: joi_1.default.number().required(),
                reqUserId: joi_1.default.number().required(),
            });
            const { userId: reqUserId } = req;
            const { id } = req.params;
            try {
                yield deleteSchema.validateAsync({ id, reqUserId });
            }
            catch (error) {
                return res.json(error);
                return res.status(400).json({ error: 'Invalid data.' });
            }
            const location = yield Locations_1.default.findOne({ where: { id } });
            if (!location) {
                return res.status(404).json({ error: 'Location not found.' });
            }
            const { user_id } = location;
            if (user_id !== reqUserId) {
                return res
                    .status(403)
                    .json({ error: 'You can only delete your own locations.' });
            }
            const deletionInfo = yield Locations_1.default.destroy({ where: { id } });
            if (!deletionInfo) {
                return res
                    .status(422)
                    .json({ error: 'Unable to delete location. Please, try again later.' });
            }
            return res.status(200).json({ sucess: 'Location successfully deleted.' });
        });
    }
    listLocaleByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: paramId } = req.params;
            const { page, limit } = paginator_info_1.paginatorParams(req);
            // const user = await Users.findAll({
            //   where: { id: paramId },
            //   attributes: ['id', 'name', 'email'],
            //   order: [['locations', 'id', 'asc']], // ordenação do relacionamento 'locations'
            //   include: [
            //     {
            //       model: Locations,
            //       where: { user_id: paramId },
            //       as: 'locations',
            //       attributes: ['id', 'name', 'latitude', 'longitude', 'type', 'adress'],
            //     },
            //   ],
            // });
            const { rows: locationsList, count: total, } = yield Locations_1.default.findAndCountAll({
                where: { user_id: paramId },
                offset: (page - 1) * limit,
                limit: limit,
                attributes: [
                    'id',
                    'name',
                    'latitude',
                    'longitude',
                    'type',
                    'adress',
                    'user_id',
                ],
            });
            return res.json({ locationsList, total, pageSize: limit });
        });
    }
}
exports.default = new LocationController();
