import request from 'supertest';
import { graphQLServer } from './graphQLServer';
import { randomBytes } from 'crypto';
import { IMiddleware } from 'graphql-middleware';
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { classMethodsToObjectMethod } from '@shared/utilities/class';

class User {
  public id: string;
  public username: string;
  public email: string;

  constructor(id: string, { username, email }: Partial<User>) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}

const usersDb: User[] = [];

class UserService {
  getUser({ id }) {
    const user = usersDb.find((user) => user.id === id);
    if (!user) {
      throw new Error('Not Found');
    }
    return user;
  }
  getUsers() {
    return usersDb;
  }
  saveUser({ userDetails }) {
    const id = randomBytes(10).toString('hex');
    const newUser = new User(id, userDetails);
    usersDb.push(newUser);
    return newUser;
  }
  updateUser({ userDetails }) {
    const currentUserIndex = usersDb.findIndex(
      (user) => user.id === userDetails.id
    );
    if (currentUserIndex === -1) {
      throw new Error('User not found');
    }
    usersDb[currentUserIndex] = new User(userDetails.id, {
      ...userDetails,
    });
    return usersDb[currentUserIndex];
  }
  deleteUser({ id }) {
    const currentUserIndex = usersDb.findIndex((user) => user.id === id);
    usersDb.slice(currentUserIndex, 1);
    return !usersDb.some((user) => user.id === id);
  }
}

const userService = new UserService();

const schema = `
  input UserInput {
    id: ID 
    username: String
    email: String
  }

  type User {
    id: ID!
    username: String
    email: String
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    saveUser(userDetails: UserInput): User
    updateUser(userDetails: UserInput): User
    deleteUser(id: ID!): Boolean
  }
`;

const rootMethods = classMethodsToObjectMethod(userService);

const userType = new GraphQLObjectType<User>({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const userInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getUser: {
      type: userType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => {
        return userService.getUser({ id });
      },
    },
    getUsers: {
      type: new GraphQLList(userType),
      resolve: userService.getUsers,
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    saveUser: {
      type: userType,
      args: {
        userDetails: { type: userInput },
      },
      resolve: (_, { userDetails }) => {
        return userService.saveUser({ userDetails });
      },
    },
    updateUser: {
      type: userType,
      args: {
        userDetails: { type: userInput },
      },
      resolve: (_, { userDetails }) => {
        return userService.updateUser({ userDetails });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_, { id }) => {
        return userService.deleteUser({ id });
      },
    },
  },
});

const schemaInstance = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

const getUsersMiddlewareMockFn = jest.fn();
const saveUserMiddlewareMockFn = jest.fn();

const getUsersMiddleware: IMiddleware = {
  Query: {
    getUsers: async (resolve, root, args, context, info) => {
      getUsersMiddlewareMockFn();
      return resolve(root, args, context, info);
    },
  },
  Mutation: {
    saveUser: async (resolve, root, args, context, info) => {
      saveUserMiddlewareMockFn();
      return resolve(root, args, context, info);
    },
  },
};

describe('graphQL server tests', () => {
  describe.each([
    [schema, rootMethods, 'graphQL schema language'],
    [schemaInstance, undefined, 'graphQLSchema instance'],
  ])('graphQlServer schema test', (schema, root, schemaType) => {
    afterAll(() => {
      usersDb.splice(0, usersDb.length);
    });

    const graphQL = graphQLServer({
      name: 'test',
      schema,
      root,
      serverMiddleware: [
        (req, res, next) => {
          if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          next();
        },
      ],
      schemaMiddleware: [getUsersMiddleware],
    });

    afterEach(() =>
      [getUsersMiddlewareMockFn, saveUserMiddlewareMockFn].forEach(
        ({ mockReset }) => mockReset()
      )
    );

    it(`${schemaType}: throws error for bad schema`, () => {
      expect(() =>
        graphQLServer({
          name: 'test',
          schema: `type Bad stuff`,
          root,
        })
      ).toThrow();
    });

    it(`${schemaType}: loads service middleware, schema middleware and schema for graphQL api`, async () => {
      const response = await request(graphQL)
        .post('/graphql')
        .send({ query: '{ getUsers { id, username, email } }' })
        .set('Authorization', 'Bearer token');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ data: { getUsers: [] } });
      expect(getUsersMiddlewareMockFn).toHaveBeenCalledTimes(1);
    });

    it(`${schemaType}: loads mutation schema for writing data`, async () => {
      const response = await request(graphQL)
        .post('/graphql')
        .send({
          query: `mutation saveUser($userDetails: UserInput) {
          saveUser(userDetails: $userDetails) {
            id, username, email
          }
        }`,
          variables: {
            userDetails: { username: 'test-user1', email: 'test@email.com' },
          },
        })
        .set('Authorization', 'Bearer token');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: {
          saveUser: {
            id: expect.any(String),
            email: 'test@email.com',
            username: 'test-user1',
          },
        },
      });
      expect(saveUserMiddlewareMockFn).toHaveBeenCalledTimes(1);
    });

    it(`${schemaType}: loads mutation schema for updating data`, async () => {
      const updateUser = usersDb[0];
      const response = await request(graphQL)
        .post('/graphql')
        .send({
          query: `mutation updateUser($userDetails: UserInput) {
          updateUser(userDetails: $userDetails) {
            id, username, email
          }
        }`,
          variables: {
            userDetails: {
              id: updateUser.id,
              username: 'new-test-user1',
              email: 'test@email.com',
            },
          },
        })
        .set('Authorization', 'Bearer token');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: {
          updateUser: {
            id: updateUser.id,
            email: 'test@email.com',
            username: 'new-test-user1',
          },
        },
      });
    });
  });
});
