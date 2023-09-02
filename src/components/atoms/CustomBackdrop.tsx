import React, { useMemo } from 'react'
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

export const CustomBackdrop = ({
  animatedIndex,
  style
}: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.5],
      Extrapolate.CLAMP
    )})`
  }))

  // styles
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  )

  const blurViewProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(
        animatedIndex.value,
        [-1, 0],
        [0, 20],
        Extrapolate.CLAMP
      )
    }
  })

  return (
    <AnimatedBlurView animatedProps={blurViewProps} style={containerStyle} />
  )
}
