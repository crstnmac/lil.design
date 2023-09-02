import { useMemo } from 'react'
import { supabase } from '../../services'

function useSupabase() {
  return useMemo(() => supabase, [])
}

export default useSupabase