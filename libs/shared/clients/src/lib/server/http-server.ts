import express, { Express, Response, RequestHandler } from 'express';

interface HttpServerOptions {
  name: string;
  port?: number;
  middlewares?: RequestHandler[];
  routes: RouteDefinition[];
  config: any;
}

interface RouteDefinition<T = Response> {
  path: string;
  method: HTTPMethod;
  middlewares: RequestHandler[];
  service: () => Promise<T>;
}

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export function httpServer({
  name,
  port = 3000,
  middlewares,
  routes,
  config = {},
}: HttpServerOptions) {
  console.log('starting server');

  const app = express();

  // add configurations

  // load app level middleware
  loadAppLevelMiddleware(middlewares, app);

  // load routes
  loadRoutes(routes, app);

  app.listen(port, () => {
    console.log(`${name} listening on port ${port}`);
  });
}

function loadAppLevelMiddleware(middlewares: RequestHandler[], app: Express) {
  for (const middleware of middlewares) {
    app.use(middleware);
  }
  console.log(`${this.name} finished`);
}

function loadRoutes(routeDefinitions: RouteDefinition[], app: Express): void {
  for (const routeDef of routeDefinitions) {
    const { method, middlewares, path, service } = routeDef;
    app[method](path, ...middlewares, service);
  }
  console.log(`${this.name} finished`);
}
