import request from 'supertest';
import app from '../src/app';

describe('POST /api/auth/register (TDD failing tests)', () => {
  const url = '/api/auth/register';

  it('returns 201 on successful registration', async () => {
    const res = await request(app)
      .post(url)
      .send({ name: 'John Doe', email: 'john@example.com', password: 'Password123' });

    expect(res.status).toBe(201);
  });

  it('returns 409 when email already exists', async () => {
    // assume the system will check for duplicates
    const payload = { name: 'Jane Doe', email: 'john@example.com', password: 'Password123' };

    const res = await request(app).post(url).send(payload);
    expect(res.status).toBe(409);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post(url).send({ email: 'no-name@example.com', password: 'Password123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post(url).send({ name: 'No Email', password: 'Password123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app).post(url).send({ name: 'Bad Email', email: 'bad-email', password: 'Password123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app).post(url).send({ name: 'No Pass', email: 'nopass@example.com' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is shorter than 8 characters', async () => {
    const res = await request(app).post(url).send({ name: 'Short', email: 'short@example.com', password: 'short' });
    expect(res.status).toBe(400);
  });
});
