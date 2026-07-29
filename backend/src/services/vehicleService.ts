import { Vehicle } from '@prisma/client';
import { CreateVehicleInput } from '../validations/vehicle';
import { createVehicle as createVehicleRecord } from '../repositories/vehicleRepository';

export const createVehicle = async (payload: CreateVehicleInput): Promise<Vehicle> => {
  return createVehicleRecord(payload);
};
