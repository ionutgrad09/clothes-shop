import { Handler } from '@netlify/functions';
import { getDb, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { userId } = verifyToken(token);
    const sql = getDb();

    const rows = await sql`
      SELECT id, email, name, role, created_at
      FROM users WHERE id = ${userId} LIMIT 1
    `;

    if (rows.length === 0) return err('User not found', 404);
    return cors({ user: rows[0] });
  } catch (e: any) {
    return err('Unauthorized', 401);
  }
};
