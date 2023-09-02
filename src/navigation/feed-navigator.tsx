import { AddPost, Feed } from '@app/screens'
import { EditProfile } from '@app/screens/EditProfile'
import { ScrollFeedScreen } from '@app/screens/ScrollFeedScreen'
import { InteractionItem } from '@app/store/feedStore'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'

export type FeedStackParamList = {
  Feed: undefined
  Post: { item: InteractionItem }
  AddPost: undefined
  EditProfile: undefined
}

const Stack = createNativeStackNavigator<FeedStackParamList>()

export const FeedNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Feed"
          options={{
            headerShown: false
          }}
          component={ScrollFeedScreen}
        />
      </Stack.Group>

      <Stack.Screen name="AddPost" component={AddPost} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  )
}
