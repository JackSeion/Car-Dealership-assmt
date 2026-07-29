import { Prisma, Vehicle } from '@prisma/client';
import { CreateVehicleInput, SearchVehicleQuery } from '../validations/vehicle';
import {
  createVehicle as createVehicleRecord,
  listVehicles as listVehiclesRecord,
  searchVehicles as searchVehiclesRecord,
} from '../repositories/vehicleRepository';

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
