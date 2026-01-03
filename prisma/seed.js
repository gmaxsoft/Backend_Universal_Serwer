import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg'; 
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

// Sprawdzenie, czy URL istnieje
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user);

  // Create MainRoutes entries
  const routes = [
    { method: 'GET', url: '/', name: 'Root API Info', modelName: null, action: null },
    { method: 'GET', url: '/users', name: 'Get All Users', modelName: 'user', action: 'findMany' },
    { method: 'GET', url: '/users/:id', name: 'Get User by ID', modelName: 'user', action: 'findUnique' },
    { method: 'POST', url: '/users', name: 'Create User', modelName: 'user', action: 'create' },
    { method: 'PUT', url: '/users/:id', name: 'Update User', modelName: 'user', action: 'update' },
    { method: 'DELETE', url: '/users/:id', name: 'Delete User', modelName: 'user', action: 'delete' },
    { method: 'GET', url: '/routes', name: 'Get All Routes', modelName: 'mainRoutes', action: 'findMany' },
    { method: 'GET', url: '/routes/:id', name: 'Get Route by ID', modelName: 'mainRoutes', action: 'findUnique' },
    { method: 'POST', url: '/routes', name: 'Create Route', modelName: 'mainRoutes', action: 'create' },
    { method: 'PUT', url: '/routes/:id', name: 'Update Route', modelName: 'mainRoutes', action: 'update' },
    { method: 'DELETE', url: '/routes/:id', name: 'Delete Route', modelName: 'mainRoutes', action: 'delete' },
  ];

  for (const route of routes) {
    const createdRoute = await prisma.mainRoutes.create({
      data: {
        method: route.method,
        url: route.url,
        name: route.name,
        userId: user.id,
      },
    });
    console.log('Created route:', createdRoute);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });