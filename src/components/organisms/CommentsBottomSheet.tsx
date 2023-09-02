import { Pressable, ListRenderItem } from 'react-native'
import React, { useCallback } from 'react'
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  useTheme
} from '@adaptui/react-native-tailwind'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { CommentItem } from '../atoms/CommentItem'
import { CustomBackdrop } from '../atoms/CustomBackdrop'
import { InteractionItem, InteractionItemComment } from '@app/store/feedStore'
import { usePost } from '@app/lib/hooks/usePost'

type CommentsBottomSheetProps = {
  item: InteractionItem
  iconColor?: string
}

export const CommentsBottomSheet = ({
  item,
  iconColor = 'black'
}: CommentsBottomSheetProps) => {
  const tw = useTheme()

  const [comment, setComment] = React.useState<string>('')

  const handleChangeText = useCallback((text: string) => {
    setComment(text)
  }, [])

  const bottomSheetRef = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => ['50%', '70%'], [])

  const { getComments, createComment, comments, isCommentsLoading } = usePost()

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present()
    void getComments(item.id)
  }, [getComments, item.id])

  const postComment = useCallback(async () => {
    if (comment.length > 0) {
      await createComment(item.id, comment)
      setComment('')
    }
  }, [comment, createComment, item.id])

  const renderItem: ListRenderItem<InteractionItemComment> = useCallback(
    ({ item, index }) => {
      return (
        <CommentItem
          interactionCommentsProfile={item.interactionCommentsProfile}
          body={item.body}
          key={`${item.id}-${index}`}
          id={item.id}
          interaction_id={item.interaction_id}
          reply_id={item.reply_id}
          user_id={item.user_id}
          created_at={item.created_at}
        />
      )
    },
    []
  )

  return (
    <>
      <Pressable onPress={() => void openBottomSheet()}>
        <AntDesign name="message1" size={24} color={iconColor} />
      </Pressable>
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        backdropComponent={CustomBackdrop}
        enableDismissOnClose
        backgroundStyle={tw.style('bg-gray-400')}
        enablePanDownToClose
      >
        <Box style={tw.style('p-3 flex-row gap-2 items-center')}>
          <Box style={tw.style('flex-1')}>
            <Input
              size="lg"
              placeholder="Add a comment"
              value={comment}
              onChangeText={handleChangeText}
            />
          </Box>

          <Button
            variant="outline"
            size="lg"
            onPress={() => void postComment()}
          >
            <Ionicons
              name="send"
              size={17}
              color={tw.getColor('text-blue-600')}
            />
          </Button>
        </Box>
        {isCommentsLoading ? (
          <Box style={tw.style('flex items-center justify-center')}>
            <Spinner size="lg" color="red" />
          </Box>
        ) : (
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            data={comments}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={tw.style('pb-6')}
            ItemSeparatorComponent={() => <Box style={tw.style('h-2')} />}
            ListEmptyComponent={() => (
              <Box style={tw.style('flex items-center justify-center')}>
                <Ionicons name="chatbox-ellipses" size={24} color="black" />
                <Box style={tw.style('h-2')} />
                <Text style={tw.style('text-sm text-gray-500')}>
                  No comments yet
                </Text>
              </Box>
            )}
          />
        )}
      </BottomSheetModal>
    </>
  )
}
