import { Handler } from '@netlify/functions';
import { getSupabase, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { userId } = verifyToken(token);
    const supabase = getSupabase();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return cors({ orders });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
