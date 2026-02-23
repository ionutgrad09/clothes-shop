import { Handler } from '@netlify/functions';
import { getSupabase, verifyToken, extractToken, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const token = extractToken(event);
    if (!token) return err('Unauthorized', 401);

    const { userId } = verifyToken(token);
    const { items, shipping_address } = JSON.parse(event.body || '{}');

    if (!items?.length || !shipping_address) return err('Items and shipping address required');

    const supabase = getSupabase();

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items,
        total,
        status: 'pending',
        shipping_address,
      })
      .select('*')
      .single();

    if (error) throw error;
    return cors({ order }, 201);
  } catch (e: any) {
    return err(e.message, 500);
  }
};
