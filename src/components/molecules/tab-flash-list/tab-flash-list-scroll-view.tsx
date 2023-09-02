import React from 'react'
import type { ScrollViewProps } from 'react-native'

import Animated from 'react-native-reanimated'
import { SceneComponent } from '@showtime-xyz/tab-view'

type TabScrollViewProps = ScrollViewProps & {
  index: number
}
function TabFlashListScrollViewComponent(props: TabScrollViewProps, ref: any) {
  return (
    <SceneComponent
      {...props}
      useExternalScrollView
      contentContainerStyle={{
        paddingBottom: 100
      }}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      forwardedRef={ref}
      ContainerView={Animated.ScrollView}
    />
  )
}

export const TabFlashListScrollView = React.forwardRef(
  TabFlashListScrollViewComponent
)
