import { Handler } from '@netlify/functions';
import { getDb, signToken, bcrypt, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) return err('Email and password required');

    const sql = getDb();
    const rows = await sql`
      SELECT id, email, name, role, password_hash, created_at
      FROM users WHERE email = ${email} LIMIT 1
    `;

    if (rows.length === 0) return err('Invalid credentials', 401);
    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return err('Invalid credentials', 401);

    const { password_hash, ...safeUser } = user;
    const token = signToken({ userId: user.id, role: user.role });
    return cors({ user: safeUser, token });
  } catch (e: any) {
    return err(e.message || 'Login failed', 500);
  }
};
