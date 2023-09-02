import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SplashScreen from 'expo-splash-screen'
import React, { useContext, useEffect } from 'react'

import { AuthNavigator } from './auth-navigator'
import { NavigationContainer } from './navigation-container'
import { TabNavigator } from './tabs-navigator'
import { AuthContext, AuthProvider } from '@app/providers'
import { AddPost, Onboarding, Post } from '@app/screens'
import { useSettingsStore } from '@app/store/userSettingsStore'
import { InteractionItem } from '@app/store/feedStore'

export type RootNavigator = {
  Onboarding: undefined
  Authenticate: undefined
  App: undefined
  AddPost: undefined
  Post: { item: InteractionItem }
}

const Stack = createNativeStackNavigator<RootNavigator>()

export const Root = () => {
  const { setStatus, status, isFirstTime } = useSettingsStore((s) => s)

  const auth = useContext(AuthContext)

  const user = auth.user

  const hideSplash = React.useCallback(async () => {
    await SplashScreen.hideAsync()
  }, [])

  useEffect(() => {
    if (status !== 'idle') {
      void hideSplash()
    }
  }, [hideSplash, status])

  useEffect(() => {
    if (user) {
      void setStatus('signedIn')
    } else {
      void setStatus('signedOut')
    }
  }, [setStatus, user])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'default'
      }}
    >
      {isFirstTime ? (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      ) : (
        <Stack.Group>
          {user === false || null || undefined ? (
            <Stack.Screen name="Authenticate" component={AuthNavigator} />
          ) : (
            <>
              <Stack.Screen
                name="App"
                component={TabNavigator}
                options={{
                  animation: 'slide_from_left'
                }}
              />
              <Stack.Screen
                name="AddPost"
                component={AddPost}
                options={{
                  headerShown: true,
                  animation: 'slide_from_bottom'
                }}
              />
              <Stack.Screen
                name="Post"
                component={Post}
                options={{
                  animation: 'slide_from_right'
                }}
              />
            </>
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

export const RootNavigator = () => (
  <AuthProvider>
    <NavigationContainer>
      <Root />
    </NavigationContainer>
  </AuthProvider>
)
