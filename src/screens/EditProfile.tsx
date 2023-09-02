import { ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import {
  Avatar,
  Chip,
  Colors,
  KeyboardAwareScrollView,
  Spacings
} from 'react-native-ui-lib'
import * as ImagePicker from 'expo-image-picker'

import { showMessage } from 'react-native-flash-message'
import Ionicons from '@expo/vector-icons/Ionicons'
import { v4 as uuid } from 'uuid'
import {
  Box,
  Button,
  Input,
  Text,
  useTheme
} from '@adaptui/react-native-tailwind'
import { AuthContext } from '@app/providers'
import uploadToSupabase from '@app/lib/utils/uploadToSupabase'
import { useSettingsStore } from '@app/store/userSettingsStore'
import { useProfile } from '@app/lib/hooks/useProfile'
import useSupabase from '@app/lib/hooks/utils/useSupabase'

export const EditProfile = () => {
  const [loading, setLoading] = React.useState(false)

  const supabase = useSupabase()

  const {
    username,
    website,
    fullName,
    avatar,
    bio,
    getProfileData,
    updateProfileData,
    setAvatar,
    setBio,
    setFullName,
    setUsername,
    setWebsite
  } = useProfile()

  const [uploading, setUploading] = React.useState(false)

  const { setStatus } = useSettingsStore((s) => s)

  const auth = useContext(AuthContext)

  const { session } = auth

  const tw = useTheme()

  useEffect(() => {
    void getProfileData()
  }, [getProfileData])

  const pickImage = useCallback(async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      selectionLimit: 1,
      base64: true
    })

    if (!image.canceled) {
      try {
        setUploading(true)
        const resAvatarFileName = `avatar-${uuid()}.png`

        await uploadToSupabase(
          supabase,
          image.assets[0].base64 || '',
          'png',
          'avatars',
          resAvatarFileName
        ).then((res) => {
          setAvatar(res ? res : '')
        })
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        } else {
          throw error
        }
      } finally {
        setUploading(false)
      }
    }
  }, [setAvatar, supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut().then(() => {
        showMessage({
          message: 'Signed out successfully!',
          type: 'success',
          icon: 'success',
          floating: true
        })
        void setStatus('signedOut')
        console.log('Logout')
      })
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteProfilePicture = async () => {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id.toString(),
        avatar_url: '',
        updated_at: new Date().toString()
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }

      setAvatar('')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void getProfileData()}
          />
        }
      >
        <Box style={tw.style('px-3 pt-4')}>
          <Box style={tw.style('flex-row justify-between')}>
            <Box>
              <Text style={tw.style('text-2xl font-bold')}>{username}</Text>
              <Text style={tw.style('text-sm text-neutral-500')}>
                {fullName}
              </Text>
            </Box>

            <Box>
              <Avatar
                onPress={() => void pickImage()}
                size={100}
                source={{ uri: avatar }}
                customRibbon={
                  <Chip
                    containerStyle={{
                      borderWidth: 0,
                      backgroundColor: Colors.$backgroundDangerHeavy,
                      marginLeft: Spacings.s3
                    }}
                    onPress={deleteProfilePicture}
                    leftElement={
                      uploading ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                      ) : (
                        <Ionicons
                          name="trash-bin"
                          size={15}
                          color={Colors.white}
                        />
                      )
                    }
                  />
                }
              />
            </Box>
          </Box>

          <Box style={tw.style('pt-2')}>
            <Input
              size="xl"
              placeholder="Email"
              editable={false}
              value={session?.user?.email}
            />
          </Box>
          <Box style={tw.style('pt-2')}>
            <Input
              size="xl"
              placeholder="Username"
              onChangeText={useCallback(
                (text: string) => setUsername(text),
                [setUsername]
              )}
              value={username}
              keyboardType="name-phone-pad"
            />
          </Box>
          <Box style={tw.style('pt-2')}>
            <Input
              size="xl"
              placeholder="Full Name"
              value={fullName}
              onChangeText={useCallback(
                (text: string) => setFullName(text),
                [setFullName]
              )}
            />
          </Box>
          <Box style={tw.style('pt-2')}>
            <Input
              size="xl"
              placeholder="Website"
              value={website}
              onChangeText={useCallback(
                (text: string) => setWebsite(text),
                [setWebsite]
              )}
              keyboardType="url"
            />
          </Box>

          <Box style={tw.style('pt-2')}>
            <Input
              size="xl"
              placeholder="Bio"
              value={bio}
              onChangeText={useCallback(
                (text: string) => setBio(text),
                [setBio]
              )}
              keyboardType="default"
              multiline
              numberOfLines={4}
            />
          </Box>
          <Box style={tw.style('pt-2')}>
            <Button
              size="xl"
              variant="outline"
              themeColor="primary"
              onPress={() => void updateProfileData()}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </Button>
          </Box>

          <Box style={tw.style('pt-2')}>
            <Button size="xl" onPress={() => void signOut()}>
              Sign Out
            </Button>
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </>
  )
}
