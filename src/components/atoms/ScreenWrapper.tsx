import React, { PropsWithChildren, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Box, useTailwind } from '@adaptui/react-native-tailwind'

export const ScreenWrapper = ({ children }: PropsWithChildren) => {
  const safeAreaInsets = useSafeAreaInsets()

  const tailwind = useTailwind()
  const route = useRoute()

  const [backgroundColor, setBackgroundColor] = React.useState('bg-white-900')

  useEffect(() => {
    switch (route.name) {
      case 'FeedNavigator':
        setBackgroundColor('bg-black-900')
        break
      case 'Profile':
        setBackgroundColor('bg-gray-100')
        break
      case 'AddPost':
        setBackgroundColor('bg-white-900')
        break
      default:
        setBackgroundColor('bg-white-900')
    }
  }, [route])

  return (
    <Box
      style={{
        flex: 1,
        backgroundColor: tailwind.gc(backgroundColor),
        paddingTop: route.name == 'Auth' ? 0 : safeAreaInsets.top,
        paddingBottom: Platform.OS === 'ios' ? 0 : safeAreaInsets.bottom
      }}
    >
      {children}
    </Box>
  )
}
