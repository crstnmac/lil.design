import React, { useCallback } from 'react'
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'
import { Box, Button, useTheme } from '@adaptui/react-native-tailwind'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CustomBackdrop } from '../atoms/CustomBackdrop'
import { useUserInteractionsFeed } from '../../lib/hooks/useUserInteractionsFeed'
import { InteractionItem } from '@app/store/feedStore'
import useSupabase from '@app/lib/hooks/utils/useSupabase'

type FeedItemOptionsProps = {
  item: InteractionItem
}

export const FeedItemOptionsBottomSheet = ({ item }: FeedItemOptionsProps) => {
  const bottomSheetRef = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => ['CONTENT_HEIGHT'], [])
  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout
  } = useBottomSheetDynamicSnapPoints(snapPoints)

  const supabase = useSupabase()

  const { getInitialFeedPosts } = useUserInteractionsFeed()

  const deletePost = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .match({ id: item.id })

      if (!error) {
        await getInitialFeedPosts()
        bottomSheetRef.current?.close()
        console.log('Deleted!')
      }

      if (error) {
        throw error
      }
    } catch (error) {
      console.log(error)
    }
  }, [getInitialFeedPosts, item.id, supabase])

  const inset = useSafeAreaInsets()
  const tw = useTheme()

  return (
    <>
      <Box>
        <Button
          onPress={() => bottomSheetRef.current?.present()}
          variant="subtle"
        >
          <Ionicons name="ellipsis-horizontal" size={24} />
        </Button>
      </Box>
      <BottomSheetModal
        ref={bottomSheetRef}
        contentHeight={animatedContentHeight}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        backdropComponent={CustomBackdrop}
      >
        <BottomSheetView
          onLayout={handleContentLayout}
          style={tw.style(`pb-[${inset.bottom}] px-2`)}
        >
          <Button
            size="lg"
            themeColor="danger"
            onPress={() => void deletePost()}
          >
            Delete
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
