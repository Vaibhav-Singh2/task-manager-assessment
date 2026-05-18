import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    const registerResponse = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTypeOf('string');
  });

  it('rejects duplicate registration', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Duplicate User',
      email: 'duplicate@example.com',
      password: 'password123'
    });

    const duplicateResponse = await request(app).post('/api/auth/register').send({
      name: 'Duplicate User Two',
      email: 'duplicate@example.com',
      password: 'password123'
    });

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.success).toBe(false);
  });

  it('rejects invalid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Auth User',
      email: 'auth@example.com',
      password: 'password123'
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'auth@example.com',
      password: 'wrong-password'
    });

    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body.success).toBe(false);
  });
});
