import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { FeedStackParamList } from '@app/navigation/feed-navigator'
import { FlashList } from '@shopify/flash-list'
import { Box, Button, Text, useTheme } from '@adaptui/react-native-tailwind'
import { Pressable } from 'react-native'
import { useUserInteractionsFeed } from '@app/lib/hooks/useUserInteractionsFeed'
import { RefreshControl } from 'react-native-gesture-handler'
import { InteractionItem } from '@app/store/feedStore'
import { FeedItem } from '@app/components/atoms/FeedItem'
import { ScreenWrapper } from '@app/components/atoms/ScreenWrapper'

export const Feed = () => {
  const { navigate } = useNavigation<StackNavigationProp<FeedStackParamList>>()

  const tw = useTheme()

  const {
    userInteractions,
    isUserInteractionsLoading,
    getInitialFeedPosts: getPosts
  } = useUserInteractionsFeed()

  const renderItem = React.useCallback(
    ({ item, index }: { item: InteractionItem; index: number }) => (
      <Pressable
        key={index}
        onPress={() =>
          navigate('Post', {
            item: item
          })
        }
      >
        <FeedItem item={item} />
      </Pressable>
    ),
    [navigate]
  )

  return (
    <ScreenWrapper>
      <Box style={tw.style('py-3')}>
        <Text style={tw.style('font-semibold text-center text-xl')}>
          lil.design
        </Text>
      </Box>
      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={isUserInteractionsLoading}
            onRefresh={() => void getPosts()}
          />
        }
        refreshing={isUserInteractionsLoading}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={350}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ItemSeparatorComponent={() => <Box style={tw.style('pb-2.5')} />}
        data={userInteractions}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={() => (
          <Box style={tw.style('items-center justify-center')}>
            <Button onPress={() => void getPosts()}>
              No posts yet, tap to refresh
            </Button>
          </Box>
        )}
      />
    </ScreenWrapper>
  )
}
