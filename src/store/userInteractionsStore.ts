import { create } from 'zustand'
import { InteractionItem } from './feedStore'

interface InteractionsStore {
  interactions: InteractionItem[],
  setInteractions: (interactions: InteractionItem[]) => void
  isInteractionsLoading: boolean
  setIsInteractionsLoading: (isInteractionsLoading: boolean) => void
  updateInteractions: (interaction: InteractionItem) => void
}

export const useInteractionsStore = create<InteractionsStore>((set, get) => ({
  interactions: [],
  setInteractions: (interactions: InteractionItem[]) => set({ interactions }),
  isInteractionsLoading: false,
  setIsInteractionsLoading: (isInteractionsLoading: boolean) => set({ isInteractionsLoading }),
  updateInteractions: (interaction: InteractionItem) => {
    set({
      interactions: get().interactions.filter(e => e.id !== interaction.id).concat(interaction)
    })
  }
}))

interface UserInteractionsStore {
  userInteractions: InteractionItem[],
  setUserInteractions: (interactions: InteractionItem[]) => void
  isUserInteractionsLoading: boolean
  setIsUserInteractionsLoading: (isInteractionsLoading: boolean) => void
  updateUserInteractions: (interaction: InteractionItem) => void
  removeUserInteraction: (interaction: InteractionItem) => void
}

export const useUserInteractionsStore = create<UserInteractionsStore>((set, get) => ({
  userInteractions: [],
  setUserInteractions: (userInteractions: InteractionItem[]) => set({ userInteractions }),
  isUserInteractionsLoading: false,
  setIsUserInteractionsLoading: (isUserInteractionsLoading: boolean) => set({ isUserInteractionsLoading }),
  updateUserInteractions: (interaction: InteractionItem) => {
    set({
      userInteractions: get().userInteractions.filter(e => e.id !== interaction.id).concat(interaction)
    })
  },
  removeUserInteraction: (interaction: InteractionItem) => {
    set({
      userInteractions: get().userInteractions.filter(e => e.id !== interaction.id)
    })
  }
}))

interface UserLikedStore {
  userLikedPosts: InteractionItem[],
  setUserLikedPosts: (likes: InteractionItem[]) => void
  isUserLikedPostsLoading: boolean
  setIsUserLikedPostsLoading: (isLikesLoading: boolean) => void
  removeUserLikedPost: (post: InteractionItem) => void
  updateUserLikedPosts: (post: InteractionItem) => void
}

export const useUserLikedStore = create<UserLikedStore>((set, get) => ({
  userLikedPosts: [],
  setUserLikedPosts: (likes: InteractionItem[]) => set({ userLikedPosts: likes }),
  isUserLikedPostsLoading: false,
  setIsUserLikedPostsLoading: (isLikesLoading: boolean) => set({ isUserLikedPostsLoading: isLikesLoading }),
  removeUserLikedPost: (post: InteractionItem) => {
    set({
      userLikedPosts: get().userLikedPosts.filter(e => e.id !== post.id)
    })
  },
  updateUserLikedPosts: (post: InteractionItem) => {
    set({
      userLikedPosts: get().userLikedPosts.filter(e => e.id !== post.id).concat(post)
    })
  }
}))

interface UserBookmarkStore {
  userBookmarks: InteractionItem[],
  setUserBookmarkedPosts: (bookmarks: InteractionItem[]) => void
  isUserBookmarkedPostsLoading: boolean
  setIsUserBookmarkedPostsLoading: (isBookmarksLoading: boolean) => void
  removeUserBookmarkedPost: (post: InteractionItem) => void
  updateUserBookmarkedPosts: (post: InteractionItem) => void
}

export const useUserBookmarkStore = create<UserBookmarkStore>((set, get) => ({
  userBookmarks: [],
  setUserBookmarkedPosts: (bookmarks) => set({ userBookmarks: bookmarks }),
  isUserBookmarkedPostsLoading: false,
  setIsUserBookmarkedPostsLoading: (isBookmarksLoading: boolean) => set({ isUserBookmarkedPostsLoading: isBookmarksLoading }),
  removeUserBookmarkedPost: (post) => {
    set({
      userBookmarks: get().userBookmarks.filter(e => e.id !== post.id)
    })
  },
  updateUserBookmarkedPosts: (post) => {
    set({
      userBookmarks: get().userBookmarks.filter(e => e.id !== post.id).concat(post)
    })
  }
}))
