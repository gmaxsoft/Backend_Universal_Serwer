import { handleDynamicRequest } from './dynamicHandler.js';
import { authenticateToken } from '../middleware/middleware.js';

export async function setupDynamicRoutes(app, prisma) {
  try {
    const routes = await prisma.mainRoutes.findMany({
      where: {
        modelName: { not: null },
        action: { not: null }
      }
    });

    for (const route of routes) {
      const handler = handleDynamicRequest(prisma, route.modelName, route.action);
      app[route.method.toLowerCase()](route.url, authenticateToken, handler);
      console.log(`Registered dynamic route: ${route.method} ${route.url} -> ${route.modelName}.${route.action}`);
    }
  } catch (error) {
    console.error('Error setting up dynamic routes:', error);
  }
}