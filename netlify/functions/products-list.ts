import { Handler } from '@netlify/functions';
import { getDb, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const sql = getDb();
    const { search, category } = event.queryStringParameters || {};

    let products;
    if (search && category && category !== 'all') {
      products = await sql`
        SELECT * FROM products
        WHERE name ILIKE ${'%' + search + '%'} AND category = ${category}
        ORDER BY created_at DESC
      `;
    } else if (search) {
      products = await sql`
        SELECT * FROM products
        WHERE name ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
      `;
    } else if (category && category !== 'all') {
      products = await sql`
        SELECT * FROM products
        WHERE category = ${category}
        ORDER BY created_at DESC
      `;
    } else {
      products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    }

    return cors({ products });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
