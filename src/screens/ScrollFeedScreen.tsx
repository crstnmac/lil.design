import React, { useCallback, useEffect, useRef } from 'react'
import { Box, useTheme } from '@adaptui/react-native-tailwind'
import { FlashList, ViewToken } from '@shopify/flash-list'
import { Dimensions } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { useScrollFeed } from '@app/lib/hooks/useScrollFeed'
import { InteractionItem } from '@app/store/feedStore'
import { ScrollFeedItem } from '@app/components/atoms/ScrollFeedItem'

export const ScrollFeedScreen = () => {
  const tw = useTheme()

  const { feedInteractions, isFeedInteractionsLoading, getInitialFeedPosts } =
    useScrollFeed()

  const mediaRefs = useRef<[]>([])

  const onVideoChanged = useRef(
    ({ changed }: { changed: Array<ViewToken> }) => {
      changed.forEach(({ index, isViewable }) => {
        const cell: {
          play: () => void
          stop: () => void
          unload: () => void
        } = mediaRefs.current[index || 0]
        if (isViewable && cell) {
          cell?.play()
        } else {
          cell?.stop()
        }
      })
    }
  )

  useEffect(() => getInitialFeedPosts, [getInitialFeedPosts])

  const viewHeight = Dimensions.get('window').height

  const renderItem = useCallback(
    ({ item, index }: { item: InteractionItem; index: number }) => {
      return (
        <Box style={tw.style(`flex-1 h-[${viewHeight}px]`)}>
          <ScrollFeedItem
            item={item}
            ref={(singleVideoRef: never) =>
              (mediaRefs.current[index] = singleVideoRef)
            }
          />
        </Box>
      )
    },
    [tw, viewHeight]
  )

  return (
    <FlashList
      refreshing={isFeedInteractionsLoading}
      data={feedInteractions}
      keyExtractor={(item) => `item-${item.id}`}
      pagingEnabled
      decelerationRate={'fast'}
      snapToInterval={viewHeight}
      snapToAlignment={'start'}
      renderItem={renderItem}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 0
      }}
      estimatedItemSize={Dimensions.get('window').height}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onVideoChanged.current}
      refreshControl={
        <RefreshControl
          refreshing={isFeedInteractionsLoading}
          onRefresh={() => {
            void getInitialFeedPosts()
          }}
        />
      }
    />
  )
}
