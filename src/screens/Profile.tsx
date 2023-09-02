import { Alert, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import {
  Button,
  Box,
  useTheme,
  Text,
  useTailwind,
  Avatar,
  Spinner
} from '@adaptui/react-native-tailwind'

import { showMessage } from 'react-native-flash-message'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Route, TabView } from '@showtime-xyz/tab-view'
import { useSharedValue } from 'react-native-reanimated'

import { TabBar } from 'react-native-tab-view'
import { FeedStackParamList } from '@app/navigation/feed-navigator'

import { useSettingsStore } from '@app/store/userSettingsStore'

import { useUserInteractionsFeed } from '@app/lib/hooks/useUserInteractionsFeed'
import { useProfile } from '@app/lib/hooks/useProfile'
import { useUserLikedFeed } from '@app/lib/hooks/useUserLikedInteractionsFeed'
import { useUserBookmarkFeed } from '@app/lib/hooks/useUserBookmarksFeed'
import { InteractionsTab } from '@app/components/organisms/InteractionsTab'
import { LikesTab } from '@app/components/organisms/LikesTab'
import { BookmarksTab } from '@app/components/organisms/BookmarksTab'
import { ScreenWrapper } from '@app/components/atoms/ScreenWrapper'
import useSupabase from '@app/lib/hooks/utils/useSupabase'

export type Routes = {
  key: string
  title: string
  index: number
}

type RouteProps = {
  route: Routes
}

export type Profile = {
  avatar_url: string | null
  full_name: string | null
  id: string | null
  updated_at: string | null
  username: string | null
  website: string | null
}

export const Profile = () => {
  const tw = useTheme()
  const tailwind = useTailwind()

  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>()

  const supabase = useSupabase()

  const [loading, setLoading] = React.useState(false)

  const { setStatus, resetAll } = useSettingsStore((s) => s)

  const { avatar, fullName, username, website, bio, getProfileData } =
    useProfile()

  useEffect(() => {
    void getProfileData()
  }, [getProfileData])

  const { getInitialFeedPosts } = useUserInteractionsFeed()

  const { getInitialLikedPosts } = useUserLikedFeed()

  const { getInitialBookmarkedPosts } = useUserBookmarkFeed()

  const onStartRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await getProfileData()
    await getInitialFeedPosts()
    setIsRefreshing(false)
  }, [getInitialFeedPosts, getProfileData])

  const signOut = async () => {
    try {
      await supabase.auth.signOut().then(() => {
        showMessage({
          message: 'Signed out successfully!',
          type: 'success',
          icon: 'success',
          floating: true
        })
        void setStatus('signedOut')
        resetAll()
        console.log('Logout')
      })
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const StatusBarHeight = StatusBar.currentHeight ?? 0

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [routes] = useState<Route[]>([
    { key: 'interactions', title: 'Interactions', index: 0 },
    { key: 'liked', title: 'Liked', index: 1 },
    { key: 'bookmarks', title: 'Bookmarks', index: 2 }
  ])
  const [index, setIndex] = useState(0)
  const animationHeaderPosition = useSharedValue(0)
  const animationHeaderHeight = useSharedValue(0)

  const renderScene = useCallback(({ route }: RouteProps) => {
    switch (route.key) {
      case 'interactions':
        return <InteractionsTab route={route} index={0} />
      case 'liked':
        return <LikesTab route={route} index={1} />
      case 'bookmarks':
        return <BookmarksTab route={route} index={2} />
      default:
        return null
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTabBar = (props: any) => (
    <>
      <TabBar
        {...props}
        labelStyle={{
          textTransform: 'capitalize',
          fontSize: 14,
          fontWeight: 'bold',
          color: tailwind.gc('bg-black-900')
        }}
        inactiveColor={tailwind.gc('bg-black-500')}
        indicatorStyle={{
          backgroundColor: tailwind.gc('bg-black-900')
        }}
        onTabPress={({ route }) => {
          if (route.key === 'bookmarks') {
            void getInitialBookmarkedPosts()
          } else if (route.key === 'liked') {
            void getInitialLikedPosts()
          } else {
            void getInitialFeedPosts()
          }
        }}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: '#666666',
          backgroundColor: tailwind.gc('bg-gray-100')
        }}
      />
    </>
  )

  const renderHeader = () => {
    return (
      <Box style={tw.style('pt-4 bg-gray-100')}>
        <Box style={tw.style('flex-row flex-1 justify-between py-4 px-3')}>
          <Box>
            <Text style={tw.style('font-bold text-3xl')}>{username}</Text>
            <Text style={tw.style('text-base text-gray-800')}>{fullName}</Text>
          </Box>

          <Box
            style={tw.style(
              'rounded-full border-4 border-white-900 h-28 w-28 items-center justify-center'
            )}
          >
            {avatar !== '' || undefined || null ? (
              <Avatar
                size="3xl"
                src={{ uri: avatar }}
                style={tw.style('h-25 w-25')}
              />
            ) : (
              <Spinner size="lg" />
            )}
          </Box>
        </Box>

        <Box style={tw.style('px-3')}>
          <Text>{website}</Text>
        </Box>

        <Box style={tw.style('px-3')}>
          <Text>{bio}</Text>
        </Box>

        <Box style={tw.style('flex-1 flex-row justify-between p-2')}>
          <Box style={tw.style('flex-1')}>
            <Button
              variant="outline"
              onPress={() => navigation.navigate('EditProfile')}
              size="lg"
            >
              Edit Profile
            </Button>
          </Box>

          <Box style={tw.style('flex-1 ml-3')}>
            <Button variant="outline" onPress={() => void signOut()} size="lg">
              Sign Out
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <ScreenWrapper>
      {loading ? (
        <Box style={tw.style('flex-1 items-center justify-center')}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <TabView
          renderTabBar={renderTabBar}
          onStartRefresh={() => void onStartRefresh()}
          isRefreshing={isRefreshing}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          lazy={true}
          renderScrollHeader={renderHeader}
          minHeaderHeight={StatusBarHeight}
          animationHeaderPosition={animationHeaderPosition}
          animationHeaderHeight={animationHeaderHeight}
          enableGestureRunOnJS={false}
        />
      )}
    </ScreenWrapper>
  )
}
