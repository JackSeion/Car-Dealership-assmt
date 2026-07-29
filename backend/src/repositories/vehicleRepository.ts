import { Prisma, Vehicle } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateVehicleInput } from '../validations/vehicle';

export const createVehicle = async (data: CreateVehicleInput): Promise<Vehicle> => {
  return prisma.vehicle.create({ data });
};

export const listVehicles = async (): Promise<Vehicle[]> => {
  return prisma.vehicle.findMany();
};

export const searchVehicles = async (where: Prisma.VehicleWhereInput): Promise<Vehicle[]> => {
  return prisma.vehicle.findMany({ where });
};
