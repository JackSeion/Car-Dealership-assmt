import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('GET /api/vehicles (TDD failing tests)', () => {
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

  it('returns 200 and an array of vehicles for an authenticated request', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      },
    });

    const res = await request(app).get(url).set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 and an empty array when no vehicles exist', async () => {
    const res = await request(app).get(url).set(createAuthHeader());

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const res = await request(app).get(url);

    expect(res.status).toBe(401);
  });

  it('returns 401 when the JWT token is invalid', async () => {
    const res = await request(app)
      .get(url)
      .set({ authorization: 'Bearer invalid.token.here' });

    expect(res.status).toBe(401);
  });
});
