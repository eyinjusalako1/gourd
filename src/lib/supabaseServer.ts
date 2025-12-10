import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role key (bypasses RLS)
let supabaseServerInstance: SupabaseClient | null = null

export function getSupabaseServer(): SupabaseClient {
  if (supabaseServerInstance) {
    return supabaseServerInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables.')
  }

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. ' +
      'Please add it to your Vercel project settings and redeploy.'
    )
  }

  supabaseServerInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return supabaseServerInstance
}

// Export a lazy-initialized instance
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseServer()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
}) as SupabaseClient

