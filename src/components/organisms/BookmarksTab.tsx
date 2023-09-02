import React, { useEffect } from 'react'
import { Box, Button, useTheme } from '@adaptui/react-native-tailwind'

import { useUserBookmarkFeed } from '@app/lib/hooks/useUserBookmarksFeed'
import { InteractionItem } from '@app/store/feedStore'
import { ListRenderItem } from '@shopify/flash-list'
import { FeedItem } from '../atoms/FeedItem'
import { TabFlashList } from '../molecules/tab-flash-list'

type Props = {
  route: {
    index: number
  }
  index: number
}

export const BookmarksTab = ({ route }: Props) => {
  const tw = useTheme()

  const { userBookmarks, getInitialBookmarkedPosts } = useUserBookmarkFeed()

  useEffect(() => {
    void getInitialBookmarkedPosts()
  }, [getInitialBookmarkedPosts, route.index])

  const renderItem: ListRenderItem<InteractionItem> = ({ item }) => {
    return (
      <Box>
        <FeedItem item={item} />
      </Box>
    )
  }

  return (
    <TabFlashList
      index={route.index}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={350}
      renderItem={renderItem}
      data={userBookmarks}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (
        <Box style={tw.style('px-2 pt-2')}>
          <Button size="lg" onPress={() => void getInitialBookmarkedPosts()}>
            No posts yet, tap to refresh
          </Button>
        </Box>
      )}
    />
  )
}
