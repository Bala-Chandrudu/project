import { supabase } from './supabase';

export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.admin === true;
}

export async function checkAdminAccess() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
}

export async function validateAccessKey(key: string) {
  try {
    const { data, error } = await supabase
      .from('access_keys')
      .select('id, user_id')
      .eq('key', key)
      .eq('active', true)
      .single();

    if (error) throw error;

    // Update last_used timestamp
    await supabase
      .from('access_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', data.id);

    return data.user_id;
  } catch (error) {
    return null;
  }
}