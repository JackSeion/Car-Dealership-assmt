import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('GET /api/vehicles/search (TDD failing tests)', () => {
  const url = '/api/vehicles/search';
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

  it('returns 200 with vehicles filtered by make', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    await prisma.vehicle.create({
      data: {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
      },
    });

    const res = await request(app).get(url).query({ make: 'Toyota' }).set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 with vehicles filtered by model', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 21000,
        quantity: 4,
      },
    });

    const res = await request(app).get(url).query({ model: 'Camry' }).set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 with vehicles filtered by category', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'RAV4',
        category: 'SUV',
        price: 32000,
        quantity: 2,
      },
    });

    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).get(url).query({ category: 'SUV' }).set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 with vehicles filtered by minPrice and maxPrice', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    await prisma.vehicle.create({
      data: {
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 18000,
        quantity: 3,
      },
    });

    const res = await request(app)
      .get(url)
      .query({ minPrice: 20000, maxPrice: 30000 })
      .set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 with an empty array when no vehicles match', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).get(url).query({ make: 'Honda' }).set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const res = await request(app).get(url).query({ make: 'Toyota' });

    expect(res.status).toBe(401);
  });

  it('returns 401 when the JWT token is invalid', async () => {
    const res = await request(app)
      .get(url)
      .set({ authorization: 'Bearer invalid.token.here' })
      .query({ make: 'Toyota' });

    expect(res.status).toBe(401);
  });
});
