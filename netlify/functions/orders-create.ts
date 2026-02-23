import { Handler } from '@netlify/functions';
import { getDb, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { userId } = verifyToken(token);
    const { items, shipping_address } = JSON.parse(event.body || '{}');

    if (!items?.length || !shipping_address) return err('Items and shipping address required');

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const sql = getDb();
    const rows = await sql`
      INSERT INTO orders (user_id, items, total, status, shipping_address)
      VALUES (${userId}, ${JSON.stringify(items)}, ${total}, 'pending', ${shipping_address})
      RETURNING *
    `;

    return cors({ order: rows[0] }, 201);
  } catch (e: any) {
    return err(e.message, 500);
  }
};
