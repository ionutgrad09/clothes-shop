import { Handler } from '@netlify/functions';
import { getDb, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { role } = verifyToken(token);
    if (role !== 'admin') return err('Forbidden', 403);

    const sql = getDb();
    const orders = await sql`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;

    // Reshape to match the original { users: { name, email } } structure
    const shaped = orders.map(({ user_name, user_email, ...o }) => ({
      ...o,
      users: { name: user_name, email: user_email },
    }));

    return cors({ orders: shaped });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
