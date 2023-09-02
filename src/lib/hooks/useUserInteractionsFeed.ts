import { useUserInteractionsStore } from '@app/store/userInteractionsStore'
import { useCallback, useContext } from 'react'
import { InteractionItem } from '@app/store/feedStore'
import { getScrollFeedInteractions } from '../queries/getScrollFeedInteractions'
import { supabase } from '../services'
import { AuthContext } from '@app/providers'

export function useUserInteractionsFeed() {
  const {
    userInteractions,
    setUserInteractions,
    isUserInteractionsLoading,
    setIsUserInteractionsLoading,
  } = useUserInteractionsStore((state) => state)
  const auth = useContext(AuthContext)
  const session = auth?.session
  const getInitialFeedPosts = useCallback(async () => {
    try {
      setIsUserInteractionsLoading(true)

      if (!session) throw new Error('No user on the session!')
      const { data, error } = await getScrollFeedInteractions(supabase)
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })
      if (error) {
        throw error
      }
      setUserInteractions(data as InteractionItem[])
      setIsUserInteractionsLoading(false)
    } catch (error) {
      console.error(error)
      setIsUserInteractionsLoading(false)
    }
  }, [setIsUserInteractionsLoading, setUserInteractions])

  return { userInteractions, isUserInteractionsLoading, getInitialFeedPosts }
}