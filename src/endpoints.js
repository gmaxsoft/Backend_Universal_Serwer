import express from 'express';
import { PrismaClient } from './generated/prisma.js';

const prisma = new PrismaClient();

export function setupRoutes(app) {

  // CRUD for Users
  // GET /users - Get all users
  app.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /users/:id - Get user by ID
  app.get('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /users - Create new user
  app.post('/users', async (req, res) => {
    try {
      const { email, name } = req.body;
      const user = await prisma.user.create({
        data: { email, name },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /users/:id - Update user
  app.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { email, name } = req.body;
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { email, name },
      });
      res.json(user);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /users/:id - Delete user
  app.delete('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // CRUD for MainRoutes
  // GET /routes - Get all routes
  app.get('/routes', async (req, res) => {
    try {
      const routes = await prisma.mainRoutes.findMany();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /routes/:id - Get route by ID
  app.get('/routes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const route = await prisma.mainRoutes.findUnique({
        where: { id: parseInt(id) },
      });
      if (!route) {
        return res.status(404).json({ error: 'Route not found' });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /routes - Create new route
  app.post('/routes', async (req, res) => {
    try {
      const { method, url, name, userId } = req.body;
      const route = await prisma.mainRoutes.create({
        data: { method, url, name, userId: userId ? parseInt(userId) : null },
      });
      res.status(201).json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /routes/:id - Update route
  app.put('/routes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { method, url, name, userId } = req.body;
      const route = await prisma.mainRoutes.update({
        where: { id: parseInt(id) },
        data: { method, url, name, userId: userId ? parseInt(userId) : null },
      });
      res.json(route);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Route not found' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /routes/:id - Delete route
  app.delete('/routes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.mainRoutes.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Route not found' });
      }
      res.status(500).json({ error: error.message });
    }
  });
}