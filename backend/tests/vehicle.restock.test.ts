import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('POST /api/vehicles/:id/restock (TDD failing tests)', () => {
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

  const createVehicle = () =>
    prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

  it('returns 200 when an ADMIN restocks an existing vehicle', async () => {
    const vehicle = await createVehicle();

    const res = await request(app)
      .post(`${url}/${vehicle.id}/restock`)
      .set(createAuthHeader('ADMIN'))
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
  });

  it('increases the vehicle quantity by the requested amount', async () => {
    const vehicle = await createVehicle();

    await request(app)
      .post(`${url}/${vehicle.id}/restock`)
      .set(createAuthHeader('ADMIN'))
      .send({ quantity: 3 });

    const restockedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });

    expect(restockedVehicle?.quantity).toBe(8);
  });

  it('returns 404 when the vehicle ID does not exist', async () => {
    const res = await request(app)
      .post(`${url}/nonexistent-id/restock`)
      .set(createAuthHeader('ADMIN'))
      .send({ quantity: 3 });

    expect(res.status).toBe(404);
  });

  it('returns 400 when the restock amount is zero or negative', async () => {
    const vehicle = await createVehicle();

    const zeroAmountRes = await request(app)
      .post(`${url}/${vehicle.id}/restock`)
      .set(createAuthHeader('ADMIN'))
      .send({ quantity: 0 });

    const negativeAmountRes = await request(app)
      .post(`${url}/${vehicle.id}/restock`)
      .set(createAuthHeader('ADMIN'))
      .send({ quantity: -1 });

    expect(zeroAmountRes.status).toBe(400);
    expect(negativeAmountRes.status).toBe(400);
  });

  it('returns 403 when a USER attempts to restock', async () => {
    const res = await request(app)
      .post(`${url}/nonexistent-id/restock`)
      .set(createAuthHeader('USER'))
      .send({ quantity: 3 });

    expect(res.status).toBe(403);
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const res = await request(app)
      .post(`${url}/nonexistent-id/restock`)
      .send({ quantity: 3 });

    expect(res.status).toBe(401);
  });

  it('returns 401 when the JWT token is invalid', async () => {
    const res = await request(app)
      .post(`${url}/nonexistent-id/restock`)
      .set({ authorization: 'Bearer invalid.token.here' })
      .send({ quantity: 3 });

    expect(res.status).toBe(401);
  });
});