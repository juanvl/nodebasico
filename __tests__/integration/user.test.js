import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const res = await request(app)
      .post('/users')
      .send(user);

    expect(res.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should encrypt the password at register', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to update existing user', async () => {
    const createdUser = await factory.create('User', {
      password: '123456',
    });

    const sessionResponse = await request(app)
      .post('/sessions')
      .send({ email: createdUser.email, password: '123456' });

    const { token } = sessionResponse.body;

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send({ name: 'Juan Victor' });

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Juan Victor');
  });

  it('should NOT be able to update existing user if duplicated email', async () => {
    await factory.create('User', {
      email: 'duplicated@gmail.com',
    });

    const createdUser = await factory.create('User', {
      password: '123456',
    });

    const sessionResponse = await request(app)
      .post('/sessions')
      .send({ email: createdUser.email, password: '123456' });

    const { token } = sessionResponse.body;

    const response = await request(app)
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send({ name: 'Juan Victor', email: 'duplicated@gmail.com' });

    expect(response.status).toBe(400);
  });
});
