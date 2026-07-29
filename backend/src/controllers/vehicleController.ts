import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createVehicleSchema, formatCreateVehicleValidationErrors } from '../validations/vehicle';
import { createVehicle } from '../services/vehicleService';

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
