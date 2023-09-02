import { useCallback, useContext, useState } from 'react'
import { usePostStore } from '@app/store/postStore'
import { supabase } from '../services'
import { AuthContext } from '@app/providers'

export function usePost() {
  const setComments = usePostStore((state) => state.setComments)
  const setIsCommentsLoading = usePostStore((state) => state.setIsCommentsLoading)
  const setIsLikesLoading = usePostStore((state) => state.setIsLikesLoading)
  const setLikes = usePostStore((state) => state.setLikes)
  const setIsBookmarkedByUser = usePostStore((state) => state.setIsBookmarkedByUser)
  const isLikesLoading = usePostStore((state) => state.isLikesLoading)
  const isBookmarkedByUser = usePostStore((state) => state.isBookmarkedByUser)
  const isCommentsLoading = usePostStore((state) => state.isCommentsLoading)
  const comments = usePostStore((state) => state.comments)
  const likes = usePostStore((state) => state.likes)
  const hasUserLiked = usePostStore((state) => state.hasUserLiked)
  const setHasUserLiked = usePostStore((state) => state.setHasUserLiked)

  const [likesCount, setLikesCount] = useState<number>(0)
  const [commentsCount, setCommentsCount] = useState<number>(0)

  const auth = useContext(AuthContext)
  const session = auth?.session

  const getCommentsCount = useCallback(async (postId: number) => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('interaction_id', postId)
        .order('created_at', { ascending: true })
      if (error) {
        console.log(error)
        return
      }
      setCommentsCount(count || 0)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getComments = useCallback(async (postId: number) => {
    try {
      setIsCommentsLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select('*,interactionCommentsProfile:profiles ( * )')
        .eq('interaction_id', postId)
        .order('created_at', { ascending: true })
      if (error) {
        setIsCommentsLoading(false)
        console.log(error)
        return
      }
      setComments(data as [] || [])
      await getCommentsCount(postId)
      setIsCommentsLoading(false)
    } catch (error) {
      setIsCommentsLoading(false)
      console.log(error)
    }
  }, [getCommentsCount, setComments, setIsCommentsLoading])

  const createComment = useCallback(async (postId: number, comment: string) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: session.user.id,
          body: comment,
          interaction_id: postId,
          reply_id: null
        })
        .single()
      if (error) {
        console.log(error)
        return
      }
      await getComments(postId)
      await getCommentsCount(postId)
    } catch (error) {
      console.log(error)
    }
  }, [getComments, getCommentsCount, session])

  const getLikesCount = useCallback(async (postId: number) => {
    try {
      setIsLikesLoading(true)
      const { data, error, count } = await supabase
        .from('likes')
        .select('*,interactionLikesProfile:profiles ( * )', {
          count: 'exact',
          head: true,
        })
        .eq('interaction_id', postId)
        .order('created_at', { ascending: true })
      if (error) {
        console.log(error)
        return
      }
      setLikes(data)
      setLikesCount(count || 0)
      setIsLikesLoading(false)
    } catch (error) {
      setIsLikesLoading(false)
      console.log(error)
    }
  }, [setIsLikesLoading, setLikes])

  const checkUserLikedPost = useCallback(async (postId: number) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { data, error } = await supabase
        .from('likes')
        .select('*,interactionLikesProfile:profiles ( * )')
        .eq('interaction_id', postId)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
      if (error) {
        console.log(error)
        return
      }
      setHasUserLiked(data.length > 0)
    } catch (error) {
      console.log(error)
    }
  }, [setHasUserLiked, session])

  const createLike = useCallback(async (postId: number) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: session.user.id,
          interaction_id: postId,
        })
        .single()
      if (error) {
        console.log(error)
        return
      }
      setHasUserLiked(true)
      await getLikesCount(postId)
    } catch (error) {
      console.log(error)
    }
  }, [getLikesCount, setHasUserLiked, session])

  const removeLike = useCallback(async (postId: number) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', session.user.id)
        .eq('interaction_id', postId)
      if (error) {
        console.log(error)
        return
      }
      setHasUserLiked(false)
      await getLikesCount(postId)
    } catch (error) {
      console.log(error)
    }
  }, [getLikesCount, setHasUserLiked, session])

  const bookmarkPost = useCallback(async (postId: number) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: session.user.id,
          interaction_id: postId,
        })
        .single()
      if (error) {
        console.log(error)
        return
      }
      setIsBookmarkedByUser(true)
    } catch (error) {
      console.log(error)
    }
  }, [setIsBookmarkedByUser, session])

  const removeBookmark = useCallback(async (postId: number) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', session.user.id)
        .eq('interaction_id', postId)
      if (error) {
        console.log(error)
        return
      }
      setIsBookmarkedByUser(false)
    } catch (error) {
      console.log(error)

    }
  }, [setIsBookmarkedByUser, session])

  const checkUserBookmarkedPost = useCallback(async (postId: number) => {
    try {
      if (!session?.user) throw new Error('No user on the session!')
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*,interactionBookmarksProfile:profiles ( * )')
        .eq('interaction_id', postId)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
      if (error) {
        console.log(error)
        return
      }
      setIsBookmarkedByUser(data.length > 0)
    } catch (error) {
      console.log(error)
    }
  }, [setIsBookmarkedByUser, session])


  return {
    getLikesCount,
    likes,
    isLikesLoading,
    likesCount,
    hasUserLiked,
    setHasUserLiked,
    createLike,
    checkUserLikedPost,
    removeLike,
    bookmarkPost,
    removeBookmark,
    isBookmarkedByUser,
    checkUserBookmarkedPost,
    commentsCount,
    getComments,
    createComment,
    comments,
    isCommentsLoading
  }
}