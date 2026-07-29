import prisma from '../config/prisma';
import { User } from '@prisma/client';

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: { name: string; email: string; password: string; role?: string }): Promise<User> => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'USER'
    }
  });
};
