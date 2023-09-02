import { Comments, Interactions, Profiles } from '@app/types/supabase'
import { create } from 'zustand'

export interface InteractionItemComment extends Comments {
  interactionCommentsProfile: Profiles
}
export interface InteractionItem extends Interactions {
  interactionUser: Profiles,
}

interface FeedStore {
  feedInteractions: InteractionItem[]
  setFeedInteractions: (interactions: InteractionItem[]) => void
  isFeedInteractionsLoading: boolean
  setIsFeedInteractionsLoading: (isInteractionsLoading: boolean) => void
  updateFeedInteractions: (interaction: InteractionItem) => void
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  feedInteractions: [],
  setFeedInteractions: (interactions: InteractionItem[]) => set({ feedInteractions: interactions }),
  isFeedInteractionsLoading: false,
  setIsFeedInteractionsLoading: (isFeedInteractionsLoading: boolean) => set({ isFeedInteractionsLoading }),
  updateFeedInteractions: (interaction: InteractionItem) => {
    set({
      feedInteractions: get().feedInteractions.filter(e => e.id !== interaction.id).concat(interaction)
    })
  }
}))