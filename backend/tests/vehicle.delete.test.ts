import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('DELETE /api/vehicles/:id (TDD failing tests)', () => {
  const url = '/api/vehicles';
  const authSecret = process.env.JWT_SECRET || 'dev-secret';

  beforeEach(async () => {
    await prisma.vehicle.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createAuthHeader = (role: 'ADMIN' | 'USER') => {
    const token = jwt.sign(
      {
        sub: 'user-id-123',
        email: `${role.toLowerCase()}@example.com`,
        role,
      },
      authSecret,
      { expiresIn: '1h' }
    );

    return { authorization: `Bearer ${token}` };
  };

  it('returns 204 when an ADMIN deletes an existing vehicle', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).delete(`${url}/${vehicle.id}`).set(createAuthHeader('ADMIN'));

    expect(res.status).toBe(204);
  });

  it('returns 404 when the vehicle does not exist', async () => {
    const res = await request(app).delete(`${url}/nonexistent-id`).set(createAuthHeader('ADMIN'));

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Vehicle not found' });
  });

  it('returns 403 when a USER attempts to delete a vehicle', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).delete(`${url}/${vehicle.id}`).set(createAuthHeader('USER'));

    expect(res.status).toBe(403);
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).delete(`${url}/${vehicle.id}`);

    expect(res.status).toBe(401);
  });

  it('returns 401 when the JWT token is invalid', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app)
      .delete(`${url}/${vehicle.id}`)
      .set({ authorization: 'Bearer invalid.token.here' });

    expect(res.status).toBe(401);
  });

  it('confirms the vehicle has been removed from the database after a successful delete', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    await request(app).delete(`${url}/${vehicle.id}`).set(createAuthHeader('ADMIN'));

    const deletedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });

    expect(deletedVehicle).toBeNull();
  });
});
