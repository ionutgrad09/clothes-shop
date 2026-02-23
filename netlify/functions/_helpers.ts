import { neon } from '@neondatabase/serverless';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export function extractToken(event: any): string | null {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export function cors(body: any, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

export function err(message: string, statusCode = 400) {
  return cors({ error: message }, statusCode);
}

export { bcrypt };
