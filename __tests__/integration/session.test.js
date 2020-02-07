import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('Session', () => {
  beforeAll(async () => {
    await factory.create('User', {
      email: 'test@gmail.com',
      password: '123456',
    });
  });

  afterAll(async () => {
    await truncate();
  });

  it('should be able to login if valid user and password', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ email: 'test@gmail.com', password: '123456' });

    expect(res.body).toHaveProperty('token');
  });

  it('should NOT be able to login if invalid form', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ email: '', password: '123456' });

    expect(res.status).toBe(400);
  });

  it('should NOT be able to login if user does not exist', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ email: 'failplease@gmail.com', password: '123456' });

    expect(res.status).toBe(400);
  });

  it('should NOT be able to login if wrong password', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ email: 'test@gmail.com', password: 'failplease' });

    expect(res.status).toBe(401);
  });
});
