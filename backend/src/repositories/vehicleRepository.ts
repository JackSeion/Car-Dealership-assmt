import { Prisma, Vehicle } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateVehicleInput, UpdateVehicleInput } from '../validations/vehicle';

export const createVehicle = async (data: CreateVehicleInput): Promise<Vehicle> => {
  return prisma.vehicle.create({ data });
};

export const findVehicleById = async (id: string): Promise<Vehicle | null> => {
  return prisma.vehicle.findUnique({ where: { id } });
};

export const updateVehicle = async (id: string, data: UpdateVehicleInput): Promise<Vehicle> => {
  return prisma.vehicle.update({
    where: { id },
    data,
  });
};

export const deleteVehicle = async (id: string): Promise<Vehicle> => {
  return prisma.vehicle.delete({
    where: { id },
  });
};

export const listVehicles = async (): Promise<Vehicle[]> => {
  return prisma.vehicle.findMany();
};

export const searchVehicles = async (where: Prisma.VehicleWhereInput): Promise<Vehicle[]> => {
  return prisma.vehicle.findMany({ where });
};
