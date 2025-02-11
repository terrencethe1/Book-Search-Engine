import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'test';



export const authMiddleware = ({ req }: any) => {
  const token = req.headers.authorization?.split(' ')[1] || '';

  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return { user: decoded };
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  return { user: null };
};
  



export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const authenticateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { user: decoded };
  } catch (err) {
    console.error('Invalid token', err);
    return { user: null };
  }
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};


