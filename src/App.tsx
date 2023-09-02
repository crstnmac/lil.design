/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'react-native-gesture-handler'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback } from 'react'
import FlashMessage from 'react-native-flash-message'

import { RootNavigator } from './navigation/root-navigator'
import { AdaptUIProvider, Box, useTheme } from '@adaptui/react-native-tailwind'
import tailwindConfig from '../tailwind.config.js'
import { useFonts } from 'expo-font'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

void SplashScreen.preventAutoHideAsync()

const InteractionApp = () => {
  const tw = useTheme()
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-ExtraLight': require('../assets/fonts/Inter-ExtraLight.ttf'),
    'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('../assets/fonts/Inter-Thin.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])
  if (!fontsLoaded) {
    return null
  }
  return (
    <Box onLayout={() => void onLayoutRootView()} style={tw.style('flex-1')}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />
      <RootNavigator />
    </Box>
  )
}

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AdaptUIProvider extend={tailwindConfig}>
            <BottomSheetModalProvider>
              <InteractionApp />
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </AdaptUIProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default App
