import { Text } from 'react-native'
import React from 'react'
import { Avatar, Box, useTheme } from '@adaptui/react-native-tailwind'
import moment from 'moment'

import { InteractionItemComment } from '@app/store/feedStore'

export const CommentItem = (props: InteractionItemComment) => {
  const { body, created_at, interactionCommentsProfile } = props

  const tw = useTheme()

  return (
    <Box
      style={tw.style(
        'p-3 mx-3 rounded-2xl bg-gray-200 border border-gray-500'
      )}
    >
      <Box
        style={[
          tw.style('flex-row'),
          {
            gap: 10
          }
        ]}
      >
        <Avatar
          size="xl"
          src={{
            uri:
              interactionCommentsProfile.avatar_url ||
              'https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png'
          }}
        />
        <Box>
          <Text style={tw.style('text-xs')}>
            {interactionCommentsProfile.full_name}
          </Text>
          <Text style={tw.style('text-xs font-semibold')}>
            {interactionCommentsProfile.username}
          </Text>
        </Box>
      </Box>
      <Box style={tw.style('py-1')}>
        <Text style={tw.style('text-sm')}>{body}</Text>
      </Box>
      <Text style={tw.style('text-xs font-semibold')}>
        {moment(created_at).fromNow()}
      </Text>
    </Box>
  )
}
