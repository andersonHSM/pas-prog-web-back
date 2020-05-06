import { UpdateOptions } from 'sequelize';
import { Request, Response } from 'express';
import Joi from '@hapi/joi';

import Locations from '../models/Locations';
import { SignedRequest } from '../interfaces/SignedRequest';
import { paginatorParams } from '../auxiliaries/paginator-info';
import { resolveSoa } from 'dns';

class LocationController {
  async store(req: SignedRequest, res: Response) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(60).required(),
      adress: Joi.string().min(5).max(80).required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      type: Joi.string().max(30).required(),
      user_id: Joi.number().required(),
      active: Joi.boolean(),
    });

    const { userId } = req;

    const locationData = {
      ...req.body,
      user_id: userId,
    };

    try {
      const schemaMatchs = await schema.validateAsync(locationData);
    } catch (error) {
      return res.status(400).json({ error: 'Verify inputed data.' });
    }

    const location = await Locations.create(locationData);

    return res.json({ location });
  }

  async index(req: Request, res: Response) {
    const { page, limit } = paginatorParams(req);

    const {
      rows: locationsList,
      count: total,
    } = await Locations.findAndCountAll({
      where: { active: true },
      offset: (page - 1) * limit,
      limit: limit,
      order: ['id'],
      attributes: ['id', 'name', 'type', 'longitude', 'latitude', 'adress'],
    });

    return res.status(200).json({ locationsList, total, pageSize: limit });
  }

  async update(req: SignedRequest, res: Response) {
    const { id } = req.params;
    const locationUpdateSchema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string(),
      active: Joi.boolean(),
      adress: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      type: Joi.string(),
      userId: Joi.number().required(),
    });

    const { userId } = req;

    try {
      await locationUpdateSchema.validateAsync({
        id,
        ...req.body,
        userId,
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid location data inputed, please verify you fields.',
      });
    }

    const currentLocationData = await Locations.findOne({ where: { id } });

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

    const updateOptions: UpdateOptions = {
      where: { id },
      fields: fieldToUpdate,
    };

    await Locations.update(req.body, updateOptions);

    const updatedLocation = await Locations.findOne({ where: { id } });

    return res.json({ updatedLocation });
  }

  async delete(req: SignedRequest, res: Response) {
    const deleteSchema = Joi.object({
      id: Joi.number().required(),
      reqUserId: Joi.number().required(),
    });

    const { userId: reqUserId } = req;
    const { id } = req.params;

    try {
      await deleteSchema.validateAsync({ id, reqUserId });
    } catch (error) {
      return res.json(error);
      return res.status(400).json({ error: 'Invalid data.' });
    }

    const location = await Locations.findOne({ where: { id } });

    if (!location) {
      return res.status(404).json({ error: 'Location not found.' });
    }

    const { user_id } = location;

    if (user_id !== reqUserId) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own locations.' });
    }

    const deletionInfo = await Locations.destroy({ where: { id } });

    if (!deletionInfo) {
      return res
        .status(422)
        .json({ error: 'Unable to delete location. Please, try again later.' });
    }

    return res.status(200).json({ sucess: 'Location successfully deleted.' });
  }

  async listLocaleByUser(req: SignedRequest, res: Response) {
    const { id: paramId } = req.params;

    const { page, limit } = paginatorParams(req);

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

    const {
      rows: locationsList,
      count: total,
    } = await Locations.findAndCountAll({
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
  }
}

export default new LocationController();
