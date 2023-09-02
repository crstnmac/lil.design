import React, { useState } from 'react'

import {
  useTheme,
  Text,
  Box,
  Input,
  Button,
  useTailwind,
  Icon,
  Close
} from '@adaptui/react-native-tailwind'
import { ImageBackground } from 'expo-image'
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints
} from '@gorhom/bottom-sheet'

import { useFocusEffect } from '@react-navigation/native'
import { AvoidSoftInput } from 'react-native-avoid-softinput'
import { StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import useSupabase from '@app/lib/hooks/utils/useSupabase'

import { useSettingsStore } from '@app/store/userSettingsStore'
import { showMessage } from 'react-native-flash-message'
import { ScreenWrapper } from '@app/components/atoms/ScreenWrapper'
import { TouchableOpacity } from 'react-native-gesture-handler'

const SNAP_POINTS = ['CONTENT_HEIGHT']

const Backdrop: React.FC = () => <Box style={styles.backdrop} />

export const Auth = () => {
  const tw = useTheme()
  const tailwind = useTailwind()
  const supabase = useSupabase()
  const inset = useSafeAreaInsets()

  const EMAIL_REGEX = new RegExp(
    '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
  )

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { setStatus } = useSettingsStore((s) => s)

  const loginBottomSheetModalRef = React.useRef<BottomSheetModal>(null)
  const signUpBottomSheetModalRef = React.useRef<BottomSheetModal>(null)

  function dismissBottomSheet(type: 'login' | 'signup') {
    switch (type) {
      case 'login':
        loginBottomSheetModalRef.current?.dismiss()
        break
      case 'signup':
        signUpBottomSheetModalRef.current?.dismiss()
        break
    }
  }

  function presentBottomSheet(type: 'login' | 'signup') {
    switch (type) {
      case 'login':
        loginBottomSheetModalRef.current?.present()
        break
      case 'signup':
        signUpBottomSheetModalRef.current?.present()
        break
    }
  }

  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout
  } = useBottomSheetDynamicSnapPoints(SNAP_POINTS)

  const onFocusEffect = React.useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true)
    AvoidSoftInput.setEnabled(true)
    AvoidSoftInput.setAvoidOffset(80)

    return () => {
      AvoidSoftInput.setAvoidOffset(0)
      AvoidSoftInput.setEnabled(false)
      AvoidSoftInput.setShouldMimicIOSBehavior(false)
    }
  }, [])

  useFocusEffect(onFocusEffect)

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (!error) {
      showMessage({
        message: 'Account created successfully!',
        description: 'Success!Check your email for the confirmation link.',
        type: 'success',
        icon: 'success',
        duration: 3000,
        floating: true,
        backgroundColor: tailwind.gc('bg-success-600'),
        color: '#fff'
      })
      setEmail('')
      setPassword('')
    }

    if (error) {
      showMessage({
        message: 'Invalid Credentials!',
        description: 'Please try again.',
        type: 'danger',
        icon: 'danger',
        duration: 3000,
        floating: true,
        backgroundColor: tailwind.gc('bg-danger-600'),
        color: '#fff'
      })
    }
    setLoading(false)
  }

  async function signInWithEmail() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (data) {
      showMessage({
        message: 'Logged in successfully!',
        description: 'You are now logged in.',
        type: 'success',
        icon: 'success',
        duration: 3000,
        floating: true,
        backgroundColor: tailwind.gc('bg-success-600'),
        color: '#fff'
      })
      setEmail('')
      setPassword('')
      void setStatus('signedIn')
    }

    if (error) {
      showMessage({
        message: 'Invalid Credentials!',
        description: 'Please try again.',
        type: 'danger',
        icon: 'danger',
        duration: 3000,
        floating: true,
        backgroundColor: tailwind.gc('bg-danger-600'),
        color: '#fff'
      })
    }
    setLoading(false)
  }

  return (
    <ScreenWrapper>
      <ImageBackground
        style={tw.style('flex-1 h-full w-full')}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        source={require('../../assets/mesh-gradient.png')}
        contentFit="cover"
      >
        <SafeAreaView
          edges={['left', 'right', 'bottom']}
          style={tw.style(`flex-1 bg-transparent pb-[${inset.bottom}px]`)}
        >
          <Box style={tw.style('flex-1 justify-center p-4')}>
            <Box>
              <Text
                style={tw.style(
                  'font-extrabold text-3xl text-white-900 text-center uppercase'
                )}
              >
                Welcome to
              </Text>
              <Text
                style={tw.style(
                  'font-semibold text-4xl text-white-900 text-center'
                )}
              >
                lil.design
              </Text>
            </Box>
          </Box>

          <BottomSheetModal
            ref={loginBottomSheetModalRef}
            backdropComponent={Backdrop}
            contentHeight={animatedContentHeight}
            enableDismissOnClose
            enablePanDownToClose
            onDismiss={() => dismissBottomSheet('login')}
            handleHeight={animatedHandleHeight}
            index={0}
            snapPoints={animatedSnapPoints}
          >
            <BottomSheetView
              onLayout={handleContentLayout}
              style={styles.bottomSheet}
            >
              <SafeAreaView
                edges={['bottom', 'left', 'right']}
                style={styles.bottomSheet}
              >
                <Box style={tw.style('px-4')}>
                  <Box
                    style={tw.style('flex-row justify-between items-center')}
                  >
                    <Text
                      style={tw.style('font-semibold text-2xl text-gray-900')}
                    >
                      Login
                    </Text>
                  </Box>
                  <Box style={tw.style('py-1 self-stretch mt-5')}>
                    <Input
                      variant="outline"
                      size="xl"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      inputMode="email"
                      invalid={email.length > 0 && !EMAIL_REGEX.test(email)}
                      placeholder="email@address.com"
                      autoCapitalize={'none'}
                    />
                  </Box>
                  <Box style={tw.style('self-stretch')}>
                    <Input
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      inputMode="text"
                      variant="outline"
                      invalid={password.length > 0 && password.length < 8}
                      size="xl"
                      secureTextEntry={true}
                      placeholder="Enter your password"
                      autoCapitalize={'none'}
                    />
                  </Box>
                  <Box style={tw.style('py-1 self-stretch mt-3 ')}>
                    <Button
                      size="xl"
                      themeColor="primary"
                      disabled={loading}
                      loading={loading}
                      onPress={() => void signInWithEmail()}
                    >
                      Login
                    </Button>
                  </Box>

                  <Box style={tw.style('py-1 self-stretch')}>
                    <Text style={tw.style('text-center text-black-900')}>
                      By loggin in, you agree to our{' '}
                      <Text style={tw.style('text-primary-500')}>
                        Terms of Service and Privacy Policy
                      </Text>
                    </Text>
                  </Box>
                </Box>
              </SafeAreaView>
            </BottomSheetView>
          </BottomSheetModal>

          <BottomSheetModal
            ref={signUpBottomSheetModalRef}
            backdropComponent={Backdrop}
            contentHeight={animatedContentHeight}
            enableDismissOnClose
            enablePanDownToClose
            onDismiss={() => dismissBottomSheet('signup')}
            handleHeight={animatedHandleHeight}
            index={0}
            snapPoints={animatedSnapPoints}
          >
            <BottomSheetView
              onLayout={handleContentLayout}
              style={styles.bottomSheet}
            >
              <SafeAreaView
                edges={['bottom', 'left', 'right']}
                style={styles.bottomSheet}
              >
                <Box style={tw.style('px-4')}>
                  <Box
                    style={tw.style('flex-row justify-between items-center')}
                  >
                    <Text
                      style={tw.style('font-semibold text-2xl text-gray-900')}
                    >
                      Signup
                    </Text>
                  </Box>
                  <Box style={tw.style('py-1 self-stretch mt-5')}>
                    <Input
                      variant="outline"
                      size="xl"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      inputMode="email"
                      invalid={email.length > 0 && !EMAIL_REGEX.test(email)}
                      placeholder="email@address.com"
                      autoCapitalize={'none'}
                    />
                  </Box>
                  <Box style={tw.style('self-stretch')}>
                    <Input
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      inputMode="text"
                      variant="outline"
                      invalid={password.length > 0 && password.length < 8}
                      size="xl"
                      secureTextEntry={true}
                      placeholder="Enter your password"
                      autoCapitalize={'none'}
                    />
                  </Box>
                  <Box style={tw.style('py-1 self-stretch mt-3 ')}>
                    <Button
                      size="xl"
                      themeColor="primary"
                      disabled={loading}
                      loading={loading}
                      onPress={() => void signUpWithEmail()}
                    >
                      Create Account
                    </Button>
                  </Box>

                  <Box style={tw.style('py-1 self-stretch')}>
                    <Text style={tw.style('text-center text-black-900')}>
                      By signing up, you agree to our{' '}
                      <Text style={tw.style('text-primary-500')}>
                        Terms of Service and Privacy Policy
                      </Text>
                    </Text>
                  </Box>
                </Box>
              </SafeAreaView>
            </BottomSheetView>
          </BottomSheetModal>

          <Box
            style={tw.style(
              `absolute w-full px-2 bottom-[${inset.bottom}px] pb-1.5 px-4`
            )}
          >
            <Button
              onPress={() => presentBottomSheet('login')}
              style={tw.style('w-full')}
              variant="outline"
              size="xl"
            >
              Sign in
            </Button>

            <Box style={tw.style('mt-2')}>
              <Button
                onPress={() => presentBottomSheet('signup')}
                style={tw.style('w-full')}
                variant="solid"
                size="xl"
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </SafeAreaView>
      </ImageBackground>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.0)'
  },
  bottomSheet: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
    paddingBottom: 10
  },
  header: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    paddingBottom: 40,
    paddingTop: 30
  },
  input: {
    marginHorizontal: 50
  },
  submitButtonContainer: {
    alignSelf: 'stretch',
    marginBottom: 30
  }
})
