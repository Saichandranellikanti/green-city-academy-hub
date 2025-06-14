
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Check if Supabase environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create client if both environment variables are present
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function recordImpression(courseKey: string, userId: string) {
  if (!supabase) {
    console.log('Supabase not configured - impression not recorded:', { courseKey, userId })
    return
  }
  
  try {
    await supabase
      .from('impressions')
      .insert({ course_key: courseKey, user_id: userId })
  } catch (error) {
    console.error('Failed to record impression:', error)
  }
}

export async function recordClick(courseKey: string, userId: string) {
  if (!supabase) {
    console.log('Supabase not configured - click not recorded:', { courseKey, userId })
    return
  }
  
  try {
    await supabase
      .from('clicks')
      .insert({ course_key: courseKey, user_id: userId })
  } catch (error) {
    console.error('Failed to record click:', error)
  }
}
