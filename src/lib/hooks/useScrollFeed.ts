import { InteractionItem, useFeedStore } from '@app/store/feedStore'
import { useCallback, useEffect } from 'react'
import { Interactions } from '@app/types/supabase'
import { useQuery } from '@tanstack/react-query'
import { getScrollFeedInteractions } from '../queries/getScrollFeedInteractions'
import { supabase } from '../services'

export function useScrollFeed() {
  const {
    feedInteractions,
    setFeedInteractions,
    isFeedInteractionsLoading,
    setIsFeedInteractionsLoading,
    updateFeedInteractions
  } = useFeedStore((s) => s)

  const key = ['scroll_feed_changes']

  const { data, error, refetch: refetchScrollFeed, isFetching } = useQuery(
    key,
    async () => {
      return getScrollFeedInteractions(supabase)
    }
  )

  const getInitialFeedPosts = useCallback(() => {
    try {
      setIsFeedInteractionsLoading(true)
      if (error) {
        console.log(error)
        return
      }
      setFeedInteractions(data?.data as unknown as InteractionItem[])
      setIsFeedInteractionsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }, [data, error, setIsFeedInteractionsLoading, setFeedInteractions])

  useEffect(() => {
    void getInitialFeedPosts()

    try {
      setIsFeedInteractionsLoading(true)
      supabase
        .channel('scroll_feed_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            table: 'interactions',
            schema: 'public'
          },
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (payload) => {
            const newInteraction = payload.new as Interactions

            const { data, error } = await getScrollFeedInteractions(supabase)
              .eq('id', newInteraction.id)
              .maybeSingle()

            if (error) {
              console.log(error)
              return
            }

            console.log(data)

            if (payload.eventType === 'INSERT') {
              updateFeedInteractions(data as unknown as InteractionItem)
            }
          }
        )
        .subscribe()
    } finally {
      setIsFeedInteractionsLoading(false)
    }
  }, [getInitialFeedPosts, setIsFeedInteractionsLoading, updateFeedInteractions])

  return {
    feedInteractions,
    isFeedInteractionsLoading,
    getInitialFeedPosts,
    refetchScrollFeed,
    isFetching
  }
}