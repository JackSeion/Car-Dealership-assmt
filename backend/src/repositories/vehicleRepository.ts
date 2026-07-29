import { Vehicle } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateVehicleInput } from '../validations/vehicle';

export const createVehicle = async (data: CreateVehicleInput): Promise<Vehicle> => {
  return prisma.vehicle.create({ data });
};
