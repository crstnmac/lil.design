import { useUserLikedStore } from '@app/store/userInteractionsStore'
import { useCallback, useContext } from 'react'
import { InteractionItem } from '@app/store/feedStore'
import { getScrollFeedInteractions } from '../queries/getScrollFeedInteractions'
import { supabase } from '../services'
import { AuthContext } from '@app/providers'

export function useUserLikedFeed() {
  const {
    userLikedPosts,
    setUserLikedPosts,
    isUserLikedPostsLoading,
    setIsUserLikedPostsLoading,
  } = useUserLikedStore((state) => state)

  const auth = useContext(AuthContext)
  const session = auth?.session

  const getInitialLikedPosts = useCallback(async () => {
    try {
      setIsUserLikedPostsLoading(true)
      //get my interactions
      const { data, error } = await supabase
        .from('likes')
        .select('id, user_id, interaction_id, created_at')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })

      const interactionIds =
        data?.map((bookmark) => bookmark.interaction_id) || []

      const { data: postData } = await getScrollFeedInteractions(supabase)
        .in('id', interactionIds)
        .order('created_at', { ascending: false })

      if (postData && postData.length > 0) {
        setUserLikedPosts(postData as InteractionItem[])
      } else {
        setUserLikedPosts([])
      }

      if (error) {
        console.log(error)
        return
      }
    } finally {
      setIsUserLikedPostsLoading(false)
    }
  }, [session?.user?.id, setIsUserLikedPostsLoading, setUserLikedPosts])

  return {
    userLikedPosts,
    isUserLikedPostsLoading,
    getInitialLikedPosts,
  }
}