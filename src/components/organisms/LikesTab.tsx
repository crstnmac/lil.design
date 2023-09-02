import React, { useEffect } from 'react'
import { Box, Button, useTheme } from '@adaptui/react-native-tailwind'
import { FeedItem } from '../atoms/FeedItem'
import { TabFlashList } from '../molecules/tab-flash-list'
import { useUserLikedFeed } from '@app/lib/hooks/useUserLikedInteractionsFeed'
import { ListRenderItem } from '@shopify/flash-list'
import { InteractionItem } from '@app/store/feedStore'

type Props = {
  route: {
    index: number
  }
  index: number
}

export const LikesTab = ({ route }: Props) => {
  const tw = useTheme()

  const { userLikedPosts, getInitialLikedPosts } = useUserLikedFeed()

  useEffect(() => {
    void getInitialLikedPosts()
  }, [getInitialLikedPosts, route.index])

  const renderItem: ListRenderItem<InteractionItem> = ({ item }) => {
    return <FeedItem item={item} />
  }

  return (
    <TabFlashList
      index={route.index}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={350}
      renderItem={renderItem}
      data={userLikedPosts}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (
        <Box style={tw.style('px-2 pt-2')}>
          <Button size="lg" onPress={() => void getInitialLikedPosts()}>
            No posts yet, tap to refresh
          </Button>
        </Box>
      )}
    />
  )
}
