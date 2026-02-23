import { Handler } from '@netlify/functions';
import { getSupabase, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const { id } = event.queryStringParameters || {};
    if (!id) return err('Product ID required');

    const supabase = getSupabase();
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) return err('Product not found', 404);
    return cors({ product });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
