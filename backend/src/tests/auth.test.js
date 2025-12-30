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

describe('Auth routes', () => {
  it('should sign up a new user and return a token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password1'
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login an existing user and return a token', async () => {
    await request(app).post('/api/auth/signup').send({
      fullName: 'Login User',
      email: 'login@example.com',
      password: 'Password1'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'Password1'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@example.com');
  });
});


