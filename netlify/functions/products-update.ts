import { Handler } from '@netlify/functions';
import { getDb, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'PUT') return err('Method not allowed', 405);

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { role } = verifyToken(token);
    if (role !== 'admin') return err('Forbidden', 403);

    const { id, name, description, price, category, sizes, colors, image_url, stock } =
      JSON.parse(event.body || '{}');
    if (!id) return err('Product ID required');

    const sql = getDb();
    const rows = await sql`
      UPDATE products SET
        name = ${name},
        description = ${description},
        price = ${price},
        category = ${category},
        sizes = ${sizes},
        colors = ${colors},
        image_url = ${image_url},
        stock = ${stock}
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) return err('Product not found', 404);
    return cors({ product: rows[0] });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
