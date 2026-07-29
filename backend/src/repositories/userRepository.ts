import prisma from '../config/prisma';

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: {name: string, email: string; password: string; role?: string }) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'USER'
    }
  });
};
