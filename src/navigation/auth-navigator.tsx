import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'

import { Auth } from '@app/screens'

export type AuthStackParamList = {
  Auth: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
