import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'test';

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

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
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
