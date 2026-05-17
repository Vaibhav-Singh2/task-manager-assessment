import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

const registerAndLogin = async (): Promise<string> => {
  await request(app).post('/api/auth/register').send({
    name: 'Task User',
    email: 'task@example.com',
    password: 'password123'
  });

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'task@example.com',
    password: 'password123'
  });

  return loginResponse.body.token as string;
};

describe('Task API', () => {
  it('performs CRUD with auth', async () => {
    const token = await registerAndLogin();

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Finish project', priority: 'high', dueDate: '2026-12-01' });

    expect(createResponse.status).toBe(201);

    const listResponse = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.length).toBe(1);

    const taskId = createResponse.body.data.id as string;

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.completed).toBe(true);

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
  });
});
