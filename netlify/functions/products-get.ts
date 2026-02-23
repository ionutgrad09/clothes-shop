import { Handler } from '@netlify/functions';
import { getDb, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const { id } = event.queryStringParameters || {};
    if (!id) return err('Product ID required');

    const sql = getDb();
    const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;

    if (rows.length === 0) return err('Product not found', 404);
    return cors({ product: rows[0] });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
