import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { FeedStackParamList } from '@app/navigation/feed-navigator'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Pressable } from 'react-native'
import { ScreenWrapper } from '@app/components/atoms/ScreenWrapper'
import {
  Avatar,
  Box,
  useTheme,
  Text,
  Spinner
} from '@adaptui/react-native-tailwind'
import moment from 'moment'
import { FeedItemOptionsBottomSheet } from '@app/components/organisms/FeedItemOptionsBottomSheet'
import { ResizeMode, Video } from 'expo-av'
import { CommentsBottomSheet } from '@app/components/organisms/CommentsBottomSheet'
import { usePost } from '@app/lib/hooks/usePost'

export const Post = ({
  route,
  navigation
}: StackScreenProps<FeedStackParamList, 'Post'>) => {
  const { item } = route.params
  const tw = useTheme()

  const [isVideoLoading, setIsVideoLoading] = React.useState(true)

  const { interactionUser } = item

  const { commentsCount } = usePost()

  const {
    createLike,
    removeLike,
    hasUserLiked,
    likesCount,
    bookmarkPost,
    isBookmarkedByUser,
    removeBookmark
  } = usePost()

  return (
    <ScreenWrapper>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          paddingLeft: 10
        }}
      >
        <Ionicons name="arrow-back" size={25} color="black" />
      </Pressable>
      <Box style={tw.style('flex-1 p-1.5')}>
        <Box style={tw.style('flex-1 bg-white-900 p-4 rounded-3xl')}>
          <Box style={tw.style('flex-row justify-between items-start gap-2')}>
            <Box style={tw.style('flex-row items-start gap-2')}>
              <Avatar
                size="2xl"
                src={{
                  uri: interactionUser.avatar_url
                    ? interactionUser.avatar_url
                    : 'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
                }}
              />
              <Box style={tw.style('flex-row gap-1.5 items-start')}>
                <Box style={tw.style('flex-col')}>
                  <Text>{interactionUser.full_name}</Text>
                  <Text style={tw.style('font-bold')}>
                    #{interactionUser.username}
                  </Text>
                </Box>

                <Text style={tw.style('text-xs')}>
                  {moment(item.created_at).fromNow()}
                </Text>
              </Box>
            </Box>

            <FeedItemOptionsBottomSheet item={item} />
          </Box>

          <Box style={tw.style('pl-12')}>
            <Text style={tw.style('text-sm')}>{item.description}</Text>
            <Box
              style={[
                tw.style(
                  'rounded-2xl mt-3 overflow-hidden items-center border-[0.5px] border-gray-400'
                )
              ]}
            >
              {item.media_url && (
                <Video
                  style={{
                    width: '100%',
                    height: 300
                  }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={true}
                  isLooping
                  isMuted
                  posterStyle={{ resizeMode: 'cover', height: '100%' }}
                  source={{
                    uri: item.media_url
                  }}
                  onLoadStart={() => setIsVideoLoading(true)}
                  onLoad={() => setIsVideoLoading(false)}
                >
                  {isVideoLoading && (
                    <Box
                      style={[
                        tw.style(
                          'absolute w-full h-full flex-row justify-center items-center'
                        )
                      ]}
                    >
                      <Spinner size="lg" />
                    </Box>
                  )}
                </Video>
              )}
            </Box>

            <Box
              style={[
                tw.style('flex-row rounded-2xl justify-between py-1 mt-3 px-2')
              ]}
            >
              <Box
                style={[
                  tw.style('flex-row justify-center items-center gap-2.5')
                ]}
              >
                <CommentsBottomSheet
                  item={item}
                  iconColor={tw.getColor('text-black-900')}
                />
                {commentsCount > 0 && <Text>{commentsCount}</Text>}
              </Box>
              <Box
                style={[
                  tw.style('flex-row justify-center items-center'),
                  {
                    gap: 5
                  }
                ]}
              >
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
                    <Ionicons
                      name="heart"
                      size={24}
                      color={tw.getColor('text-red-600')}
                    />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={24}
                      color={tw.getColor('text-black-900')}
                    />
                  )}
                </Pressable>
                {likesCount > 0 && <Text>{likesCount}</Text>}
              </Box>
              <Box
                style={[
                  tw.style('flex-row justify-center items-center gap-2.5')
                ]}
              >
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
                    <Ionicons
                      name="bookmark"
                      size={24}
                      color={tw.getColor('text-black-900')}
                    />
                  ) : (
                    <Ionicons
                      name="bookmark-outline"
                      size={24}
                      color={tw.getColor('text-black-900')}
                    />
                  )}
                </Pressable>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ScreenWrapper>
  )
}
