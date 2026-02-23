import { Handler } from '@netlify/functions';
import { getSupabase, signToken, bcrypt, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const { email, password, name } = JSON.parse(event.body || '{}');
    if (!email || !password || !name) return err('All fields required');

    const supabase = getSupabase();

    // Check existing
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (existing) return err('Email already registered');

    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, name, password_hash, role: 'customer' })
      .select('id, email, name, role, created_at')
      .single();

    if (error) throw error;

    const token = signToken({ userId: user.id, role: user.role });
    return cors({ user, token }, 201);
  } catch (e: any) {
    return err(e.message || 'Registration failed', 500);
  }
};
