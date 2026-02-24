import { Handler } from '@netlify/functions';
import { getSupabase, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { role } = verifyToken(token);
    if (role !== 'admin') return err('Forbidden', 403);

    const { name, description, price, category, sizes, colors, image_url, stock } =
      JSON.parse(event.body || '{}');

    if (!name || !price || !category) return err('Name, price and category required');

    const supabase = getSupabase();
    const { data: product, error } = await supabase
      .from('products')
      .insert({ name, description, price, category, sizes, colors, image_url, stock })
      .select('*')
      .single();

    if (error) throw error;
    return cors({ product }, 201);
  } catch (e: any) {
    return err(e.message, 500);
  }
};
