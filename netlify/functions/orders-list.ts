import { Handler } from '@netlify/functions';
import { getDb, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { userId } = verifyToken(token);
    const sql = getDb();

    const orders = await sql`
      SELECT * FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return cors({ orders });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
