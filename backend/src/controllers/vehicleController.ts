import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createVehicleSchema,
  formatCreateVehicleValidationErrors,
  searchVehicleQuerySchema,
} from '../validations/vehicle';
import { createVehicle, listVehicles, searchVehicles } from '../services/vehicleService';

export const createVehicleController = async (req: Request, res: Response) => {
  try {
    const payload = createVehicleSchema.parse(req.body);
    const vehicle = await createVehicle(payload);
    return res.status(201).json(vehicle);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: formatCreateVehicleValidationErrors(err.issues) });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const listVehiclesController = async (_req: Request, res: Response) => {
  const vehicles = await listVehicles();
  return res.status(200).json(vehicles);
};

export const searchVehiclesController = async (req: Request, res: Response) => {
  const searchQuery = searchVehicleQuerySchema.parse(req.query);
  const vehicles = await searchVehicles(searchQuery);
  return res.status(200).json(vehicles);
};
