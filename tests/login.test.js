const request = require('supertest');
const mongoose = require('mongoose');
const { app, createMySQLPool } = require('../app');
const User = require('../models/User');  // Mock the user model

const jwt = require('jsonwebtoken');

// Setup & Cleanup
beforeAll(async () => {
  // Create MySQL pool before running tests
  await createMySQLPool();
  
  // Connect to MongoDB (Assuming you have a test database set up)
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  // Close MongoDB connection and clear database after all tests
  await mongoose.connection.close();
});

// Mock user data
const mockUser = {
  email: "testuser@example.com",
  password: "password123",
  name: "Test User",
};

describe('POST /api/v1/register', () => {
  afterEach(async () => {
    // Cleanup - remove the user after each test
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/register')
      .send({
        username: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(201);

    expect(res.body.person).toHaveProperty('name', mockUser.name);
    expect(res.body.person).toHaveProperty('email', mockUser.email);

    const userInDb = await User.findOne({ email: mockUser.email });
    expect(userInDb).toBeTruthy();
    expect(userInDb.name).toBe(mockUser.name);
  });

  it('should return error if email is already registered', async () => {
    // Insert a user first
    const newUser = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    });
    await newUser.save();

    const res = await request(app)
      .post('/api/v1/register')
      .send({
        username: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(400);

    expect(res.body).toHaveProperty('msg', 'Email already in use');
  });

  it('should return error if any field is missing', async () => {
    const res = await request(app)
      .post('/api/v1/register')
      .send({
        username: mockUser.name,
        email: mockUser.email,
        password: '', // Missing password
      })
      .expect(400);

    expect(res.body).toHaveProperty('msg', 'Please add all values in the request body');
  });
});

describe('POST /api/v1/login', () => {
  beforeEach(async () => {
    // Create a user before each test
    const newUser = new User({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    });
    await newUser.save();
  });

  afterEach(async () => {
    // Cleanup - remove users after each test
    await User.deleteMany({});
  });

  it('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(200);

    expect(res.body).toHaveProperty('email', mockUser.email);
    expect(res.body).toHaveProperty('name', mockUser.name);
    expect(res.body).toHaveProperty('token');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('name', mockUser.name);
  });

  it('should return an error if email is not found', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: "nonexistentuser@example.com",
        password: mockUser.password,
      })
      .expect(400);

    expect(res.body).toHaveProperty('msg', 'Bad credentails');
  });

  it('should return an error if the password is incorrect', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: mockUser.email,
        password: "wrongpassword",
      })
      .expect(400);

    expect(res.body).toHaveProperty('msg', 'Bad password');
  });

  it('should return an error if email or password is missing', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: "", // Missing email
        password: "password123",
      })
      .expect(400);

    expect(res.body).toHaveProperty('msg', 'Bad request. Please add email and password in the request body');
  });
});
