const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  process.env.JWT_EXPIRES = '1d';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Auth validation', () => {
  it('should reject signup with invalid email format', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'invalid-email',
      password: 'Password1'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid email');
  });

  it('should reject signup with weak password', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'weak'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Password must be at least 8 characters');
  });

  it('should reject login with missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required');
  });
});

