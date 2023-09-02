import { useUserBookmarkStore } from '@app/store/userInteractionsStore'
import { useCallback, useContext } from 'react'
import { InteractionItem } from '@app/store/feedStore'
import { getScrollFeedInteractions } from '../queries/getScrollFeedInteractions'
import { supabase } from '../services'
import { AuthContext } from '@app/providers'

export function useUserBookmarkFeed() {
  const {
    userBookmarks,
    setUserBookmarkedPosts,
    isUserBookmarkedPostsLoading,
    setIsUserBookmarkedPostsLoading,
  } = useUserBookmarkStore((state) => state)

  const auth = useContext(AuthContext)
  const session = auth?.session

  const getInitialBookmarkedPosts = useCallback(async () => {
    try {
      setIsUserBookmarkedPostsLoading(true)
      //get my interactions
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id, user_id, interaction_id, created_at')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })

      const interactionIds =
        data?.map((bookmark) => bookmark.interaction_id) || []

      const { data: postData } = await getScrollFeedInteractions(supabase)
        .in('id', interactionIds)
        .order('created_at', { ascending: false })

      if (postData && postData.length > 0) {
        setUserBookmarkedPosts(postData as InteractionItem[])
      } else {
        setUserBookmarkedPosts([])
      }

      if (error) {
        console.log(error)
        return
      }
    } finally {
      setIsUserBookmarkedPostsLoading(false)
    }
  }, [session?.user.id, setIsUserBookmarkedPostsLoading, setUserBookmarkedPosts])

  return {
    userBookmarks,
    isUserBookmarkedPostsLoading,
    getInitialBookmarkedPosts,
  }
}