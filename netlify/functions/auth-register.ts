import { Handler } from '@netlify/functions';
import { getDb, signToken, bcrypt, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const { email, password, name } = JSON.parse(event.body || '{}');
    if (!email || !password || !name) return err('All fields required');

    const sql = getDb();

    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) return err('Email already registered');

    const password_hash = await bcrypt.hash(password, 10);

    const rows = await sql`
      INSERT INTO users (email, name, password_hash, role)
      VALUES (${email}, ${name}, ${password_hash}, 'customer')
      RETURNING id, email, name, role, created_at
    `;
    const user = rows[0];

    const token = signToken({ userId: user.id, role: user.role });
    return cors({ user, token }, 201);
  } catch (e: any) {
    return err(e.message || 'Registration failed', 500);
  }
};
