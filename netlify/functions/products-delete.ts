import { Handler } from '@netlify/functions';
import { getSupabase, verifyToken, extractToken, cors, err } from './_helpers';

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

    const supabase = getSupabase();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return cors({ success: true });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
