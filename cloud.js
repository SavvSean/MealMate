/* Small browser-only Supabase adapter. The database enforces user isolation via RLS. */
(() => {
  'use strict';
  const cfg = window.MEALMATE_CONFIG || {};
  const url = String(cfg.supabaseUrl || '').trim();
  const key = String(cfg.supabasePublishableKey || '').trim();
  const enabled = /^https:\/\/[\w-]+\.supabase\.co\/?$/.test(url) && !!key && !!window.supabase?.createClient;
  let client = null;
  let sessionHandler = () => {};
  if (enabled) client = window.supabase.createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  function conflictError() {
    const error = new Error('Your cloud kitchen changed on another device.');
    error.code = 'MEALMATE_CONFLICT';
    return error;
  }
  const api = {
    enabled,
    onSession(fn) { sessionHandler = fn; },
    async init() {
      if (!client) return;
      // auth events may fire while the client initializes; defer any async database work.
      client.auth.onAuthStateChange((event, session) => {
        if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION', 'USER_UPDATED'].includes(event)) {
          setTimeout(() => sessionHandler(session?.user || null), 0);
        }
      });
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      sessionHandler(data.session?.user || null);
    },
    async login(email, password) {
      const { data, error } = await client.auth.signInWithPassword({email, password});
      if (error) throw error;
      return data;
    },
    async signup(email, password) {
      const { data, error } = await client.auth.signUp({email, password});
      if (error) throw error;
      return data;
    },
    async logout() {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },
    async read(userId) {
      const { data, error } = await client.from('kitchen_state')
        .select('data,updated_at,revision').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data;
    },
    // Community recipes live in a separate table; private kitchens remain unchanged.
    async listCommunity() {
      if (!client) throw new Error('Sign in to open the Community Cookbook.');
      const { data, error } = await client.from('community_recipes')
        .select('id,author_id,source_recipe_id,author_name,name,time_label,icon,ingredients,steps,updated_at')
        .order('updated_at', { ascending: false }).limit(60);
      if (error) throw error;
      return data || [];
    },
    async publishCommunity(post) {
      if (!client) throw new Error('Cloud connection unavailable.');
      const { data, error } = await client.from('community_recipes')
        .upsert(post, { onConflict: 'author_id,source_recipe_id' })
        .select('id').single();
      if (error) throw error;
      return data;
    },
    async updateChefName(ownerId, name) {
      if (!client) throw new Error('Cloud connection unavailable.');
      const { error } = await client.from('community_recipes')
        .update({ author_name: name, updated_at: new Date().toISOString() })
        .eq('author_id', ownerId);
      if (error) throw error;
    },
    async removeCommunity(id, ownerId) {
      if (!client) throw new Error('Cloud connection unavailable.');
      const { data, error } = await client.from('community_recipes')
        .delete().eq('id', id).eq('author_id', ownerId).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Recipe not found or you are not its author.');
    },
    async reportCommunity(recipeId, reporterId, reason) {
      if (!client) throw new Error('Cloud connection unavailable.');
      const { error } = await client.from('recipe_reports')
        .insert({ recipe_id: recipeId, reporter_id: reporterId, reason });
      if (error) throw error;
    },
    // Optimistic concurrency: the revision condition is part of the UPDATE itself.
    // A stale tab cannot silently replace the newer whole-kitchen JSON document.
    async write(userId, state, expectedRevision) {
      if (!client) throw new Error('Cloud connection unavailable.');
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) {
        throw new Error('Cloud revision missing. Run kitchen_revision.sql and reopen your kitchen.');
      }
      if (expectedRevision === 0) {
        const { data, error } = await client.from('kitchen_state')
          .insert({ user_id: userId, data: state, revision: 1 })
          .select('revision').single();
        if (error?.code === '23505') throw conflictError();
        if (error) throw error;
        return data.revision;
      }
      const { data, error } = await client.from('kitchen_state')
        .update({
          data: state,
          revision: expectedRevision + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('revision', expectedRevision)
        .select('revision').maybeSingle();
      if (error) throw error;
      if (!data) throw conflictError();
      return data.revision;
    }

  };
  window.MealMateCloud = api;
})();
