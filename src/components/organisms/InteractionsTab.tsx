import React, { useEffect } from 'react'

import { Box, Button, useTheme } from '@adaptui/react-native-tailwind'
import { FeedItem } from '../atoms/FeedItem'
import { TabFlashList } from '../molecules/tab-flash-list'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RootNavigator } from '@app/navigation'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useUserInteractionsFeed } from '@app/lib/hooks/useUserInteractionsFeed'
import { ListRenderItem } from '@shopify/flash-list'
import { InteractionItem } from '@app/store/feedStore'

type Props = {
  route: {
    index: number
  }
  index: number
}

export const InteractionsTab = ({ route }: Props) => {
  const tw = useTheme()

  const { getInitialFeedPosts, userInteractions } = useUserInteractionsFeed()

  useEffect(() => {
    void getInitialFeedPosts()
  }, [getInitialFeedPosts, route.index])

  const navigation = useNavigation<NativeStackNavigationProp<RootNavigator>>()

  const renderItem: ListRenderItem<InteractionItem> = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('Post', {
            item
          })
        }
      >
        <FeedItem item={item} />
      </Pressable>
    )
  }

  return (
    <TabFlashList
      index={route.index}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={350}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      data={userInteractions}
      maintainVisibleContentPosition={
        route.index === 0
          ? { minIndexForVisible: 0, autoscrollToTopThreshold: 0.5 }
          : undefined
      }
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={() => (
        <Box style={tw.style('px-2 pt-2')}>
          <Button size="lg" onPress={() => void getInitialFeedPosts()}>
            No posts yet, tap to refresh
          </Button>
        </Box>
      )}
    />
  )
}
