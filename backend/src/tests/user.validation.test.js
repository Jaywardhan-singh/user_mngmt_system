const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

let mongoServer;
let userToken;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  process.env.JWT_EXPIRES = '1d';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const password = await bcrypt.hash('Password1', 10);
  const user = await User.create({
    fullName: 'Test User',
    email: 'testuser@example.com',
    password
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser@example.com',
    password: 'Password1'
  });

  userToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('User validation', () => {
  it('should reject profile update with invalid email format', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        fullName: 'Updated Name',
        email: 'invalid-email'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid email format');
  });

  it('should reject password change with weak password', async () => {
    const res = await request(app)
      .patch('/api/users/me/password')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        currentPassword: 'Password1',
        newPassword: 'weak'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Password must be at least 8 characters');
  });
});

