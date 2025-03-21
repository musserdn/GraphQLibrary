import jwt from 'jsonwebtoken';
import { GraphQLError, GraphQLErrorOptions } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';

export const authenticateToken = ({ req }: any) => {
  const token = req.headers.authorization?.split(' ')[1];


  const { operationName } = req.body;

  if (operationName === 'addUser' || operationName === 'login') {
    return req;
  }

  if (!token) {
    throw new GraphQLError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = decoded;
  } catch (err) {
    console.error(err);
    throw new GraphQLError('Invalid or expired token');
  }

  return req;
};

export const signToken = (username: string, email: string, _id: string): string => {
  const payload: JwtPayload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    const options: GraphQLErrorOptions = {
      extensions: { code: 'UNAUTHENTICATED' },
    };
    super(message, options);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};