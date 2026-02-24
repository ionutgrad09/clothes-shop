import { Handler } from '@netlify/functions';
import { getSupabase, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});

  try {
    const supabase = getSupabase();
    const { search, category } = event.queryStringParameters || {};

    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;
    if (error) throw error;
    return cors({ products });
  } catch (e: any) {
    return err(e.message, 500);
  }
};
