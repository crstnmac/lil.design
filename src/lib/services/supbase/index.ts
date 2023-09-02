import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'

import { SUPABASE_PROJ_URL, SUPABASE_ANON_KEY } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '@app/types/supabase'

const supabaseUrl = SUPABASE_PROJ_URL
const supabaseAnonKey = SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as never,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type Client = typeof supabase