import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('POST /api/vehicles (TDD failing tests)', () => {
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

  it('returns 201 when a valid authenticated request creates a vehicle', async () => {
    const res = await request(app)
      .post(url)
      .set(createAuthHeader())
      .send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      });

    expect(res.status).toBe(201);
  });

  it('returns 400 when the make is missing', async () => {
    const res = await request(app)
      .post(url)
      .set(createAuthHeader())
      .send({
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      });

    expect(res.status).toBe(400);
  });

  it('returns 400 when price is invalid (<= 0)', async () => {
    const res = await request(app)
      .post(url)
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
    const res = await request(app)
      .post(url)
      .set(createAuthHeader())
      .send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: -1,
      });

    expect(res.status).toBe(400);
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const res = await request(app).post(url).send({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    });

    expect(res.status).toBe(401);
  });
});
