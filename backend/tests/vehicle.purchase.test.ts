import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('POST /api/vehicles/:id/purchase (TDD failing tests)', () => {
  const url = '/api/vehicles';
  const authSecret = process.env.JWT_SECRET || 'dev-secret';

  beforeEach(async () => {
    await prisma.vehicle.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createAuthHeader = () => {
    const token = jwt.sign(
      {
        sub: 'user-id-123',
        email: 'buyer@example.com',
      },
      authSecret,
      { expiresIn: '1h' }
    );

    return { authorization: `Bearer ${token}` };
  };

  it('returns 200 when purchasing a vehicle with available stock', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).post(`${url}/${vehicle.id}/purchase`).set(createAuthHeader());

    expect(res.status).toBe(200);
  });

  it('decreases the vehicle quantity by 1 after purchase', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    await request(app).post(`${url}/${vehicle.id}/purchase`).set(createAuthHeader());

    const purchasedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });

    expect(purchasedVehicle?.quantity).toBe(4);
  });

  it('returns 400 when the quantity is already 0', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 0,
      },
    });

    const res = await request(app).post(`${url}/${vehicle.id}/purchase`).set(createAuthHeader());

    expect(res.status).toBe(400);
  });

  it('returns 404 when the vehicle ID does not exist', async () => {
    const res = await request(app).post(`${url}/nonexistent-id/purchase`).set(createAuthHeader());

    expect(res.status).toBe(404);
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

    const res = await request(app).post(`${url}/${vehicle.id}/purchase`);

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
      .post(`${url}/${vehicle.id}/purchase`)
      .set({ authorization: 'Bearer invalid.token.here' });

    expect(res.status).toBe(401);
  });
});
