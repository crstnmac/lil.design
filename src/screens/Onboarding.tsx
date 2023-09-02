import React from 'react'
import { Box, Button, Text, useTheme } from '@adaptui/react-native-tailwind'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSettingsStore } from '@app/store/userSettingsStore'
import { ScreenWrapper } from '@app/components/atoms/ScreenWrapper'

export const Onboarding = () => {
  const { setIsFirstTime } = useSettingsStore((s) => s)
  const tw = useTheme()

  return (
    <ScreenWrapper>
      <Box style={tw.style('flex-1 justify-center items-center')}>
        <Text style={tw.style('font-bold text-3xl')}>lil.design</Text>
        <Text>where UI interaction comes to life!</Text>
      </Box>
      <SafeAreaView>
        <Box style={tw.style('self-stretch px-2')}>
          <Button size="xl" onPress={() => setIsFirstTime(false)}>
            Get Started
          </Button>
        </Box>
      </SafeAreaView>
    </ScreenWrapper>
  )
}
