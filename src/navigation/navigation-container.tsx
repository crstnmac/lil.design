import { Spinner } from '@adaptui/react-native-tailwind'
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native'
import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export const NavigationContainer = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <SafeAreaProvider>
      <React.Suspense fallback={<Spinner size="lg" />}>
        <RNNavigationContainer>{children}</RNNavigationContainer>
      </React.Suspense>
    </SafeAreaProvider>
  )
}
