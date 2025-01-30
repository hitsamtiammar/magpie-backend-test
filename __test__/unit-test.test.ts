import { mockDeep } from 'jest-mock-extended';
import { prisma } from 'prisma';
import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import login, { LoginRequest } from '../src/routes/home/login';

// Mocking Prisma and bcrypt using jest-mock-extended and jest.spyOn
jest.mock('prisma', () => ({
  prisma: mockDeep(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('Login Endpoint', () => {
  let fastify: FastifyInstance;
  let request: FastifyRequest<{ Body: LoginRequest }>;
  let reply: FastifyReply;

  beforeEach(() => {
    fastify = mockDeep<FastifyInstance>();
    request = mockDeep<FastifyRequest<{ Body: LoginRequest }>>();
    reply = mockDeep<FastifyReply>();

    // Use jest.spyOn to spy on the methods
    jest.spyOn(fastify.jwt, 'sign').mockImplementationOnce(() => 'mock-token'); // Mock JWT token generation

    // Spy on prisma.user.findFirst to return null for not found user
    jest.spyOn(prisma.user, 'findFirst').mockImplementationOnce(() => Promise.resolve(null)); // Mock user not found

    // Spy on bcrypt.compare to return false by default for incorrect password
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false)); // Mock incorrect password
  });

  it('should return 404 when user not found', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    request.body = { email: mockEmail, password: mockPassword };

    // Mock user not found
    jest.spyOn(prisma.user, 'findFirst').mockImplementationOnce(() => Promise.resolve(null));

    await login(fastify)(request, reply);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: mockEmail }
    });
    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      status: false,
      message: 'User not found',
    });
  });

  it('should return 400 when password is incorrect', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    request.body = { email: mockEmail, password: mockPassword };

    const mockUser = { email: mockEmail, password: 'hashedpassword', name: 'Test User' };
    // Mock user found
    jest.spyOn(prisma.user, 'findFirst').mockImplementationOnce(() => Promise.resolve(mockUser));

    // Mock incorrect password comparison
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

    await login(fastify)(request, reply);

    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, 'hashedpassword');
    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      status: false,
      message: 'Password wrong',
    });
  });

  it('should return 201 and token when login is successful', async () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    request.body = { email: mockEmail, password: mockPassword };

    const mockUser = { email: mockEmail, password: 'hashedpassword', name: 'Test User' };
    // Mock user found
    jest.spyOn(prisma.user, 'findFirst').mockImplementationOnce(() => Promise.resolve(mockUser));

    // Mock correct password comparison
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

    await login(fastify)(request, reply);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: mockEmail }
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, 'hashedpassword');
    expect(fastify.jwt.sign).toHaveBeenCalledWith({
      user: mockUser.name,
      email: mockEmail,
      date: expect.any(Number),
    });
    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({
      status: true,
      token: 'mock-token',
    });
  });
});
