import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createVehicleSchema,
  formatCreateVehicleValidationErrors,
  searchVehicleQuerySchema,
  updateVehicleSchema,
} from '../validations/vehicle';
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle,
} from '../services/vehicleService';
import { isHttpError } from '../utils/errors';

type RestockRequestBody = {
  quantity: number;
};

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

export const updateVehicleController = async (req: Request, res: Response) => {
  try {
    const payload = updateVehicleSchema.parse(req.body);
    const vehicle = await updateVehicle(req.params.id, payload);
    return res.status(200).json(vehicle);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: formatCreateVehicleValidationErrors(err.issues) });
    }

    if (isHttpError(err)) {
      return res.status(err.status || 500).json({ message: err.message || 'Error' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    await deleteVehicle(req.params.id);
    return res.status(204).send();
  } catch (err: unknown) {
    if (isHttpError(err)) {
      const status = err.status || 500;
      const message = err.message || 'Error';

      return res.status(status).json({ message });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const purchaseVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await purchaseVehicle(req.params.id);
    return res.status(200).json(vehicle);
  } catch (err: unknown) {
    if (isHttpError(err)) {
      const status = err.status || 500;
      const message = err.message || 'Error';

      return res.status(status).json({ message });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const restockVehicleController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as RestockRequestBody;
    const updatedVehicle = await restockVehicle(req.params.id, payload.quantity);
    return res.status(200).json(updatedVehicle);
  } catch (err: unknown) {
    if (isHttpError(err)) {
      const status = err.status || 500;
      const message = err.message || 'Error';

      return res.status(status).json({ message });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
