import { Prisma, Vehicle } from '@prisma/client';
import { CreateVehicleInput, SearchVehicleQuery, UpdateVehicleInput } from '../validations/vehicle';
import {
  createVehicle as createVehicleRecord,
  deleteVehicle as deleteVehicleRecord,
  findVehicleById as findVehicleByIdRecord,
  listVehicles as listVehiclesRecord,
  searchVehicles as searchVehiclesRecord,
  updateVehicle as updateVehicleRecord,
} from '../repositories/vehicleRepository';
import { createHttpError } from '../utils/errors';

export const createVehicle = async (payload: CreateVehicleInput): Promise<Vehicle> => {
  return createVehicleRecord(payload);
};

export const listVehicles = async (): Promise<Vehicle[]> => {
  return listVehiclesRecord();
};

const exactMatchFilters: Array<[key: keyof Pick<SearchVehicleQuery, 'make' | 'model' | 'category'>, field: keyof Pick<Prisma.VehicleWhereInput, 'make' | 'model' | 'category'>]> = [
  ['make', 'make'],
  ['model', 'model'],
  ['category', 'category'],
];

const buildPriceFilter = (query: SearchVehicleQuery): Prisma.FloatFilter | undefined => {
  if (query.minPrice === undefined && query.maxPrice === undefined) {
    return undefined;
  }

  return {
    ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
    ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
  };
};

const buildSearchWhereClause = (query: SearchVehicleQuery): Prisma.VehicleWhereInput => {
  const where: Prisma.VehicleWhereInput = {};

  for (const [queryKey, fieldName] of exactMatchFilters) {
    const value = query[queryKey];

    if (value) {
      where[fieldName] = value;
    }
  }

  const priceFilter = buildPriceFilter(query);

  if (priceFilter) {
    where.price = priceFilter;
  }

  return where;
};

export const searchVehicles = async (query: SearchVehicleQuery): Promise<Vehicle[]> => {
  return searchVehiclesRecord(buildSearchWhereClause(query));
};

export const updateVehicle = async (id: string, payload: UpdateVehicleInput): Promise<Vehicle> => {
  const vehicle = await findVehicleByIdRecord(id);

  if (!vehicle) {
    throw createHttpError('Vehicle not found', 404);
  }

  return updateVehicleRecord(id, payload);
};

export const deleteVehicle = async (id: string): Promise<void> => {
  const existingVehicle = await findVehicleByIdRecord(id);

  if (!existingVehicle) {
    throw createHttpError('Vehicle not found', 404);
  }

  await deleteVehicleRecord(id);
};

const buildPurchasedVehicleData = (vehicle: Vehicle): UpdateVehicleInput => ({
  make: vehicle.make,
  model: vehicle.model,
  category: vehicle.category,
  price: vehicle.price,
  quantity: vehicle.quantity - 1,
});

export const purchaseVehicle = async (id: string): Promise<Vehicle> => {
  const existingVehicle = await findVehicleByIdRecord(id);

  if (!existingVehicle) {
    throw createHttpError('Vehicle not found', 404);
  }

  if (existingVehicle.quantity === 0) {
    throw createHttpError('Vehicle is out of stock', 400);
  }

  return updateVehicleRecord(id, buildPurchasedVehicleData(existingVehicle));
};
