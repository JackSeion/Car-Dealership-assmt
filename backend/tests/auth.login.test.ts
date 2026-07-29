import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('POST /api/auth/login (TDD)', () => {
  const url = '/api/auth/login';

  beforeEach(async () => {
    // clean users to ensure tests are independent
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns 200 on successful login', async () => {
    const email = `user-success-${Date.now()}@example.com`;
    const password = 'Password123';

    const reg = await request(app).post('/api/auth/register').send({ name: 'Login Success', email, password });
    expect(reg.status).toBe(201);

    const res = await request(app).post(url).send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 401 for incorrect password', async () => {
    const email = `user-wrongpass-${Date.now()}@example.com`;
    const password = 'Password123';

    const reg = await request(app).post('/api/auth/register').send({ name: 'Wrong Pass', email, password });
    expect(reg.status).toBe(201);

    const res = await request(app).post(url).send({ email, password: 'BadPass1' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for non-existent email', async () => {
    const email = `no-user-${Date.now()}@example.com`;
    const res = await request(app).post(url).send({ email, password: 'DoesNotMatter1' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post(url).send({ password: 'Password123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app).post(url).send({ email: `no-pass-${Date.now()}@example.com` });
    expect(res.status).toBe(400);
  });
});
