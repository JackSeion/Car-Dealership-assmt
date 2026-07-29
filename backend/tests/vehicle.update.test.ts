import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('PUT /api/vehicles/:id (TDD failing tests)', () => {
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
        email: 'admin@example.com',
      },
      authSecret,
      { expiresIn: '1h' }
    );

    return { authorization: `Bearer ${token}` };
  };

  it('returns 200 when an authenticated request updates an existing vehicle', async () => {
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
      .put(`${url}/${vehicle.id}`)
      .set(createAuthHeader())
      .send({
        make: 'Toyota',
        model: 'Camry Hybrid',
        category: 'Sedan',
        price: 26000,
        quantity: 4,
      });

    expect(res.status).toBe(200);
  });

  it('returns 404 when the vehicle ID does not exist', async () => {
    const res = await request(app)
      .put(`${url}/nonexistent-id`)
      .set(createAuthHeader())
      .send({
        make: 'Toyota',
        model: 'Camry Hybrid',
        category: 'Sedan',
        price: 26000,
        quantity: 4,
      });

    expect(res.status).toBe(404);
  });

  it('returns 400 when price is invalid (<= 0)', async () => {
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
      .put(`${url}/${vehicle.id}`)
      .set(createAuthHeader())
      .send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 0,
        quantity: 5,
      });

    expect(res.status).toBe(400);
  });

  it('returns 400 when quantity is negative', async () => {
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
      .put(`${url}/${vehicle.id}`)
      .set(createAuthHeader())
      .send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 26000,
        quantity: -1,
      });

    expect(res.status).toBe(400);
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

    const res = await request(app).put(`${url}/${vehicle.id}`).send({
      make: 'Toyota',
      model: 'Camry Hybrid',
      category: 'Sedan',
      price: 26000,
      quantity: 4,
    });

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
      .put(`${url}/${vehicle.id}`)
      .set({ authorization: 'Bearer invalid.token.here' })
      .send({
        make: 'Toyota',
        model: 'Camry Hybrid',
        category: 'Sedan',
        price: 26000,
        quantity: 4,
      });

    expect(res.status).toBe(401);
  });
});
