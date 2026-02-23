import { Handler } from '@netlify/functions';
import { getSupabase, signToken, bcrypt, cors, err } from './_helpers';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return cors({});
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) return err('Email and password required');

    const supabase = getSupabase();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, password_hash, created_at')
      .eq('email', email)
      .single();

    if (error || !user) return err('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return err('Invalid credentials', 401);

    const { password_hash, ...safeUser } = user;
    const token = signToken({ userId: user.id, role: user.role });
    return cors({ user: safeUser, token });
  } catch (e: any) {
    return err(e.message || 'Login failed', 500);
  }
};
