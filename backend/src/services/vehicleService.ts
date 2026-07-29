import { Vehicle } from '@prisma/client';
import { CreateVehicleInput } from '../validations/vehicle';
import { createVehicle as createVehicleRecord, listVehicles as listVehiclesRecord } from '../repositories/vehicleRepository';

export const createVehicle = async (payload: CreateVehicleInput): Promise<Vehicle> => {
  return createVehicleRecord(payload);
};

export const listVehicles = async (): Promise<Vehicle[]> => {
  return listVehiclesRecord();
};
