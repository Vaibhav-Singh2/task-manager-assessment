import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

const registerAndLogin = async (
  user: { name: string; email: string; password: string } = {
    name: 'Task User',
    email: 'task@example.com',
    password: 'password123'
  }
): Promise<string> => {
  await request(app).post('/api/auth/register').send({
    name: user.name,
    email: user.email,
    password: user.password
  });

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: user.email,
    password: user.password
  });

  return loginResponse.body.token as string;
};

describe('Task API', () => {
  it('rejects access without auth token', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

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

  it('enforces task ownership with forbidden response', async () => {
    const ownerToken = await registerAndLogin({
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123'
    });
    const otherToken = await registerAndLogin({
      name: 'Other',
      email: 'other@example.com',
      password: 'password123'
    });

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Owner Task', priority: 'medium', dueDate: '2026-12-10' });

    const taskId = createResponse.body.data.id as string;

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ completed: true });

    expect(updateResponse.status).toBe(403);
    expect(updateResponse.body.success).toBe(false);
  });

  it('filters tasks by status, priority and search', async () => {
    const token = await registerAndLogin({
      name: 'Filter User',
      email: 'filter@example.com',
      password: 'password123'
    });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Alpha build', description: 'first', priority: 'high', dueDate: '2026-12-01' });

    const secondTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Beta docs', description: 'notes', priority: 'low', dueDate: '2026-12-02' });

    await request(app)
      .put(`/api/tasks/${secondTask.body.data.id as string}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });

    const filtered = await request(app)
      .get('/api/tasks?status=completed&priority=low&search=beta')
      .set('Authorization', `Bearer ${token}`);

    expect(filtered.status).toBe(200);
    expect(filtered.body.data.length).toBe(1);
    expect(filtered.body.data[0].title).toMatch(/beta/i);
  });

  it('validates task creation payload', async () => {
    const token = await registerAndLogin({
      name: 'Validation User',
      email: 'validation@example.com',
      password: 'password123'
    });

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', priority: 'invalid', dueDate: 'not-a-date' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('paginates task results correctly', async () => {
    const token = await registerAndLogin({
      name: 'Page User',
      email: 'page@example.com',
      password: 'password123'
    });

    // Create 3 tasks
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `Paged Task ${i}`, priority: 'low', dueDate: `2026-12-0${i}` });
    }

    const page1 = await request(app)
      .get('/api/tasks?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(page1.status).toBe(200);
    expect(page1.body.data.length).toBe(2);
    expect(page1.body.total).toBe(3);

    const page2 = await request(app)
      .get('/api/tasks?page=2&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(page2.status).toBe(200);
    expect(page2.body.data.length).toBe(1);
  });

  it('sorts tasks by dueDate ascending and descending', async () => {
    const token = await registerAndLogin({
      name: 'Sort User',
      email: 'sort@example.com',
      password: 'password123'
    });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Earlier Task', priority: 'low', dueDate: '2026-01-01' });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Later Task', priority: 'high', dueDate: '2026-12-31' });

    const asc = await request(app)
      .get('/api/tasks?sortBy=dueDate&sortOrder=asc')
      .set('Authorization', `Bearer ${token}`);

    expect(asc.body.data[0].title).toBe('Earlier Task');

    const desc = await request(app)
      .get('/api/tasks?sortBy=dueDate&sortOrder=desc')
      .set('Authorization', `Bearer ${token}`);

    expect(desc.body.data[0].title).toBe('Later Task');
  });
});

