const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

let mongoServer;
let adminToken;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  process.env.JWT_EXPIRES = '1d';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const password = await bcrypt.hash('AdminPass1', 10);
  const admin = await User.create({
    fullName: 'Admin User',
    email: 'admin@example.com',
    password,
    role: 'admin'
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'AdminPass1'
  });

  adminToken = res.body.token;

  await User.create({
    fullName: 'Regular User',
    email: 'user@example.com',
    password
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('User routes', () => {
  it('should allow admin to fetch paginated users', async () => {
    const res = await request(app)
      .get('/api/users?page=1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
  });
});


