import { Handler } from '@netlify/functions';
import { getDb, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'DELETE') return err('Method not allowed', 405);

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { role } = verifyToken(token);
    if (role !== 'admin') return err('Forbidden', 403);

    const { id } = JSON.parse(event.body || '{}');
    if (!id) return err('Product ID required');

    const sql = getDb();
    await sql`DELETE FROM products WHERE id = ${id}`;
    return cors({ success: true });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
