// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// make sure you have these two in your .env:
// VITE_SUPABASE_URL=…
// VITE_SUPABASE_ANON_KEY=…
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function recordImpression(courseKey: string, userId: string) {
  await supabase
    .from('impressions')
    .insert({ course_key: courseKey, user_id: userId })
}

export async function recordClick(courseKey: string, userId: string) {
  await supabase
    .from('clicks')
    .insert({ course_key: courseKey, user_id: userId })
}
