import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { Avatar, Box, Spinner, useTheme } from '@adaptui/react-native-tailwind'
import { Pressable, Text } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'

import { InteractionItem } from '@app/store/feedStore'
import { CommentsBottomSheet } from '../organisms/CommentsBottomSheet'
import { usePost } from '@app/lib/hooks/usePost'

type FeedProps = {
  item: InteractionItem
}

export const ScrollFeedItem = forwardRef(({ item }: FeedProps, parentRef) => {
  const { interactionUser } = item

  const {
    createLike,
    removeLike,
    hasUserLiked,
    likesCount,
    bookmarkPost,
    isBookmarkedByUser,
    removeBookmark
  } = usePost()

  const [isVideoLoading, setIsVideoLoading] = React.useState(true)

  const tw = useTheme()

  const ref = useRef<Video>(null)

  useImperativeHandle(parentRef, () => ({
    play,
    stop,
    unload
  }))

  const play = useCallback(async () => {
    console.log('playing', item.id)
    if (ref.current === null) {
      return
    }
    const status = await ref.current.getStatusAsync()
    if (status.isLoaded && status?.isPlaying) {
      return
    }
    try {
      await ref.current.playAsync()
    } catch (e) {
      console.log(e)
    }
  }, [item.id])

  const stop = useCallback(async () => {
    console.log('stopping', item.id)
    if (ref.current === null) {
      return
    }
    const status = await ref.current.getStatusAsync()
    if (status?.isLoaded && !status?.isPlaying) {
      return
    }
    try {
      await ref.current.stopAsync()
    } catch (e) {
      console.log(e)
    }
  }, [item.id])

  const unload = useCallback(async () => {
    console.log('unloading', item.id)
    if (ref.current === null) {
      return
    }
    const status = await ref.current.getStatusAsync()
    if (!status?.isLoaded) {
      return
    }
    try {
      await ref.current.unloadAsync()
    } catch (e) {
      console.log(e)
    }
  }, [item.id])

  useEffect(() => {
    ref.current?.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setIsVideoLoading(false)
      }
    })
  }, [item.id])

  const safeAreaInsets = useSafeAreaInsets()
  const bottomBarHeight = useBottomTabBarHeight()

  return (
    <>
      <Video
        ref={ref}
        style={tw.style('flex-1')}
        source={{ uri: item.media_url || '' }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        isLooping={true}
        isMuted={true}
      >
        {isVideoLoading ? (
          <Box
            style={tw.style('flex-1 bg-gray-100 items-center justify-center')}
          >
            <Spinner size="lg" track="visible" />
          </Box>
        ) : (
          <></>
        )}
      </Video>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={tw.style(
          'absolute z-10 bottom-0 flex-1 w-full px-2',
          `pb-[${safeAreaInsets.bottom + bottomBarHeight}]`
        )}
      >
        <Box style={tw.style('flex-row justify-between items-end gap-2')}>
          <Box>
            <Text style={tw.style('text-white-900 text-lg font-semibold')}>
              {item.name}{' '}
            </Text>
            <Box style={tw.style('flex-row gap-2 items-center')}>
              <Text
                style={tw.style('text-white-600 text-lg font-semibold')}
              >{`@${interactionUser.username || ''}`}</Text>
              <Text
                style={tw.style('text-white-600 text-base font-semibold')}
              >{`${interactionUser.full_name || ''}`}</Text>
            </Box>
            <Text
              style={tw.style('text-white-400 text-base font-semibold')}
            >{`${item.description || ''}`}</Text>
          </Box>

          <Box style={tw.style('flex-col gap-3')}>
            <Box style={tw.style('rounded-full border-4 border-white-400')}>
              <Avatar
                size="3xl"
                src={{
                  uri: interactionUser.avatar_url
                    ? interactionUser.avatar_url
                    : 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
                }}
              />
            </Box>
            <Box style={tw.style('flex-col items-center gap-1')}>
              <Pressable
                onPress={() => {
                  if (hasUserLiked) {
                    void removeLike(item.id)
                  } else {
                    void createLike(item.id)
                  }
                }}
              >
                {hasUserLiked ? (
                  <FontAwesome name={'heart'} color="red" size={25} />
                ) : (
                  <FontAwesome name={'heart-o'} color="white" size={25} />
                )}
              </Pressable>
              <Text style={tw.style('text-white-900 text-base font-semibold')}>
                {likesCount}
              </Text>
            </Box>
            <Box style={tw.style('flex-col items-center gap-1')}>
              <CommentsBottomSheet
                item={item}
                iconColor={tw.getColor('text-white-900')}
              />
            </Box>
            <Box style={tw.style('flex-col items-center gap-2')}>
              <Pressable
                onPress={() => {
                  if (isBookmarkedByUser) {
                    void removeBookmark(item.id)
                  } else {
                    void bookmarkPost(item.id)
                  }
                }}
              >
                {isBookmarkedByUser ? (
                  <FontAwesome name={'bookmark'} color="white" size={25} />
                ) : (
                  <FontAwesome name={'bookmark-o'} color="white" size={25} />
                )}
              </Pressable>
            </Box>
          </Box>
        </Box>
      </LinearGradient>
    </>
  )
})
