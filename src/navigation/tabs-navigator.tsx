import {
  BottomTabBar,
  BottomTabBarProps,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'
import { useNavigation, type RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as React from 'react'
import { FeedNavigator } from './feed-navigator'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Profile, AddPost } from '@app/screens'
import { useTailwind } from '@adaptui/react-native-tailwind'
import { BlurView } from 'expo-blur'

type TabParamList = {
  Profile: undefined
  FeedNavigator: undefined
  AddPost: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

export type TabList<T extends keyof TabParamList> = {
  navigation: NativeStackNavigationProp<TabParamList, T>
  route: RouteProp<TabParamList, T>
}

export const TabNavigator = () => {
  const tailwind = useTailwind()
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>()

  const TabBar = (props: BottomTabBarProps) => (
    <BlurView
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.1)'
      }}
      tint="light"
      intensity={70}
    >
      <BottomTabBar {...props} />
    </BlurView>
  )

  return (
    <Tab.Navigator
      tabBar={TabBar}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderTopColor: 'transparent'
        },
        tabBarActiveTintColor: 'white'
      }}
    >
      <Tab.Group
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen
          name="FeedNavigator"
          component={FeedNavigator}
          options={{
            tabBarLabel: 'Feed',
            tabBarLabelStyle: {
              color: 'black'
            },
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="grid"
                color={focused ? 'black' : tailwind.gc('bg-black-500')}
                size={20}
              />
            )
          }}
        />
        <Tab.Screen
          name="AddPost"
          component={AddPost}
          options={{
            tabBarLabel: 'Add Post',
            tabBarLabelStyle: {
              color: 'black'
            },
            tabBarIcon: ({ focused }) => (
              <AntDesign
                name="pluscircleo"
                color={focused ? 'black' : tailwind.gc('bg-black-500')}
                size={25}
              />
            )
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              navigation.navigate('AddPost')
            }
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarLabelStyle: {
              color: 'black'
            },
            tabBarIcon: ({ focused }) => (
              <FontAwesome
                name="user"
                color={focused ? 'black' : tailwind.gc('bg-black-500')}
                size={20}
              />
            )
          }}
        />
      </Tab.Group>
    </Tab.Navigator>
  )
}
