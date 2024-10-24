import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema, GraphQLSchema } from 'graphql';
import { httpServer, HttpServerOpts } from '../server';
import { RequestHandler } from 'express';
import { applyMiddleware, IMiddleware } from 'graphql-middleware';

interface GraphQlServerOpts extends Pick<HttpServerOpts, 'name'> {
  base?: string;
  serverMiddleware?: RequestHandler[];
  schema: string | GraphQLSchema;
  schemaMiddleware?: IMiddleware[];
  root?: unknown;
}

export function graphQLServer({
  name,
  base = '/graphql',
  serverMiddleware = [],
  schema,
  schemaMiddleware = [],
  root,
}: GraphQlServerOpts) {
  const graphQlServer = httpServer({
    name,
    middleware: serverMiddleware,
  });

  let graphQlSchema: GraphQLSchema | string = schema;

  if (typeof graphQlSchema === 'string') {
    graphQlSchema = buildSchema(graphQlSchema);
  }

  const schemaWithMiddleware = applyMiddleware(
    graphQlSchema,
    ...schemaMiddleware
  );

  graphQlServer.all(
    `${base}`,
    createHandler({
      schema: schemaWithMiddleware,
      rootValue: root,
    })
  );

  return graphQlServer;
}
