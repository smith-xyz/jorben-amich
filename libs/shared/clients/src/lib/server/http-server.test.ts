import request from 'supertest';
import { httpServer, HttpServerOpts, HttpServer } from './http-server';
import { Request, Response } from 'express';
import { defaultMiddleware } from './middleware/default-middleware';

const userDb = [{ userId: 1, username: 'test' }];

async function fetchUserService(req: Request, res: Response) {
  res.json(userDb);
}

async function fetchUserServiceById(req: Request, res: Response) {
  const result = userDb.find((rec) => rec.userId === Number(req.params.userId));
  if (!result) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.json(result);
}

async function saveUser(req: Request, res: Response) {
  userDb.push(req.body);
  res.json(true);
}

async function deleteUser(req: Request, res: Response) {
  const loc = userDb.findIndex(
    (rec) => rec.userId === Number(req.params.userId)
  );
  if (loc < 0) return res.json(true);
  userDb.splice(loc, 1);
  res.json(true);
}

const serverOpts: HttpServerOpts = {
  name: 'test-server',
  middleware: defaultMiddleware({}),
  resources: {
    users: {
      version: 'v1',
      routeDefinitions: {
        get: {
          middleware: [],
          service: fetchUserService,
        },
        post: {
          middleware: [],
          service: saveUser,
        },
      },
    },

    'users/:userId': {
      version: 'v1',
      routeDefinitions: {
        get: {
          service: fetchUserServiceById,
        },
        delete: {
          service: deleteUser,
        },
      },
    },
    auth: {
      version: 'v1',
      routeDefinitions: {
        post: {
          middleware: [
            (req, res, next) => {
              if (!req.headers.authorization) {
                res.status(401).json({ error: 'Unauthorized' });
              }
              next();
            },
          ],
          service: async (req, res) => res.json(true),
        },
      },
    },
  },
};

describe('http-server tests', () => {
  const server: HttpServer = httpServer(serverOpts);

  it('creates http server with route definitions', async () => {
    const response = await request(server)
      .get('/api/v1/users')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual([{ userId: 1, username: 'test' }]);
  });

  it('allows for fetching with param', async () => {
    const response = await request(server)
      .get('/api/v1/users/1')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ userId: 1, username: 'test' });
  });

  it('allows for saving data', async () => {
    const payload = { userId: 3, username: 'new-user' };
    const response = await request(server)
      .post('/api/v1/users')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(true);

    const fetchedNewUser = await request(server)
      .get('/api/v1/users/3')
      .set('Accept', 'application/json');

    expect(fetchedNewUser.status).toEqual(200);
    expect(fetchedNewUser.headers['content-type']).toMatch(/json/);
    expect(fetchedNewUser.body).toEqual(payload);
  });

  it('allows returning service errors', async () => {
    const response = await request(server)
      .get('/api/v1/users/545')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(404);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ error: 'Not Found' });
  });

  it('allows route level middleware', async () => {
    const response = await request(server)
      .post('/api/v1/auth')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(401);

    const authResponse = await request(server)
      .post('/api/v1/auth')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(authResponse.status).toEqual(200);
  });

  it('allows delete to occur', async () => {
    const response = await request(server)
      .delete('/api/v1/users/1')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);

    const fetchDeletedUserResponse = await request(server)
      .get('/api/v1/users/1')
      .set('Accept', 'application/json');

    expect(fetchDeletedUserResponse.status).toEqual(404);
  });
});
