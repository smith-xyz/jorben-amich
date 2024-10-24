import { pipe } from '@shared/utilities';
import express, { Express, RequestHandler } from 'express';

export type ApiVersion = `${'v'}${number}`;

type ApiResourceRecord = Record<
  string,
  {
    version: ApiVersion;
    routeDefinitions: Partial<Record<HTTPMethod, RouteDefinition>>;
  }
>;

export interface HttpServerOpts {
  name: string;
  middleware?: RequestHandler[];
  resources?: ApiResourceRecord;
}

export interface RouteDefinition {
  middleware?: RequestHandler[];
  service: RequestHandler;
}

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'patch';

export type HttpServer = express.Application;

export function httpServer(serverOptions: HttpServerOpts): HttpServer {
  const app = express();

  pipe(
    loadAppLevelMiddleware,
    loadRoutes
  )({
    app,
    serverOptions,
  });

  return app;
}

function loadAppLevelMiddleware({
  app,
  serverOptions,
}: {
  app: Express;
  serverOptions: HttpServerOpts;
}) {
  const { middleware = [] } = serverOptions;
  for (const mw of middleware) {
    app.use(mw);
  }
  return { app, serverOptions };
}

function loadRoutes({
  app,
  serverOptions,
}: {
  app: Express;
  serverOptions: HttpServerOpts;
}) {
  const { resources = {} } = serverOptions;
  const resourcePaths = Object.keys(resources);
  if (resourcePaths.length === 0) return { app, serverOptions };
  const base = '/api';

  for (const resource of resourcePaths) {
    const { version, routeDefinitions } = resources[resource];
    const apiPath = `${base}/${version}/${resource}`;
    const methods = Object.keys(routeDefinitions);
    for (const method of methods) {
      const { middleware = [], service } = routeDefinitions[method];
      app[method](apiPath, ...middleware, service);
    }
  }

  return { app, serverOptions };
}
