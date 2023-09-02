import { Likes } from '@app/types/supabase'
import { create } from 'zustand'
import { InteractionItemComment } from './feedStore'

interface PostStore {
  likes: Likes[],
  setLikes: (likes: Likes[]) => void
  isLikesLoading: boolean
  setIsLikesLoading: (isLikesLoading: boolean) => void
  isBookmarkedByUser: boolean
  setIsBookmarkedByUser: (isBookmarkedByUser: boolean) => void
  likesCount: number
  setLikesCount: (likesCount: number) => void
  hasUserLiked: boolean
  setHasUserLiked: (hasUserLiked: boolean) => void
  comments: InteractionItemComment[],
  setComments: (comments: InteractionItemComment[]) => void
  isCommentsLoading: boolean
  setIsCommentsLoading: (isCommentsLoading: boolean) => void
  commentsCount: number
  setCommentsCount: (commentsCount: number) => void
}

export const usePostStore = create<PostStore>((set, get) => ({
  likes: [],
  setLikes: (likes: Likes[]) => set({ likes }),
  isLikesLoading: false,
  setIsLikesLoading: (isLikesLoading: boolean) => set({ isLikesLoading }),
  isBookmarkedByUser: false,
  setIsBookmarkedByUser: (isBookmarkedByUser: boolean) => set({ isBookmarkedByUser }),
  likesCount: 0,
  setLikesCount: (likesCount: number) => set({ likesCount }),
  hasUserLiked: false,
  setHasUserLiked: (hasUserLiked: boolean) => set({ hasUserLiked }),
  comments: [],
  setComments: (comments: InteractionItemComment[]) => set({ comments }),
  isCommentsLoading: false,
  setIsCommentsLoading: (isCommentsLoading: boolean) => set({ isCommentsLoading }),
  commentsCount: 0,
  setCommentsCount: (commentsCount: number) => set({ commentsCount }),
}))