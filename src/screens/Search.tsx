import { Box, Text, useTheme } from '@adaptui/react-native-tailwind'
import { ScreenWrapper } from '@app/components/atoms/ScreenWrapper'
import React from 'react'

export const Search = () => {
  const tw = useTheme()
  return (
    <ScreenWrapper>
      <Box style={tw.style('px-2.5 pt-2.5')}>
        <Text>Search</Text>
      </Box>
    </ScreenWrapper>
  )
}
