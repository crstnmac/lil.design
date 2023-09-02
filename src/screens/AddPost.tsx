import { Alert, ScrollView } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { v4 as uuid } from 'uuid'
import { AuthContext } from '@app/providers'
import { showMessage } from 'react-native-flash-message'
import * as ImagePicker from 'expo-image-picker'
import {
  Box,
  useTheme,
  Button,
  Text,
  Input
} from '@adaptui/react-native-tailwind'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { useUserInteractionsFeed } from '@app/lib/hooks/useUserInteractionsFeed'
import { useUserBookmarkFeed } from '@app/lib/hooks/useUserBookmarksFeed'
import { useUserLikedFeed } from '@app/lib/hooks/useUserLikedInteractionsFeed'
import useSupabase from '@app/lib/hooks/utils/useSupabase'

export const AddPost = () => {
  const navigation = useNavigation()
  const auth = useContext(AuthContext)
  const supabase = useSupabase()

  const tw = useTheme()

  const { session } = auth
  const [loading, setLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [videoUrl, setVideoUrl] = React.useState<string | null | undefined>(
    undefined
  )

  const [uploading, setUploading] = React.useState(false)

  const { getInitialFeedPosts } = useUserInteractionsFeed()

  const { getInitialBookmarkedPosts } = useUserBookmarkFeed()

  const { getInitialLikedPosts } = useUserLikedFeed()

  async function post() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const currentTime = new Date().toISOString()

      const form = {
        name: name,
        description: description,
        user_id: session.user.id.toString(),
        media_url: videoUrl,
        created_at: currentTime
      }

      const { error, status } = await supabase.from('interactions').upsert(form)

      if (status === 201) {
        setLoading(false)
        await getInitialFeedPosts()
        await getInitialLikedPosts()
        await getInitialBookmarkedPosts()
        navigation.goBack()
        showMessage({
          message: 'Success!',
          description: 'Your interaction has been posted!',
          type: 'success',
          icon: 'success',
          floating: true
        })
      }

      if (error) {
        setLoading(false)
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        setLoading(false)
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function pickVideo() {
    setUploading(true)

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      videoMaxDuration: 30,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN
    })

    if (!result.canceled) {
      const videoUri = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
        {
          encoding: 'base64'
        }
      )

      const video = {
        name: `${uuid()}.mp4`,
        type: 'video/mp4'
      }

      const { data, error } = await supabase.storage
        .from('interactions')
        .upload(video.name, decode(videoUri), {
          contentType: video.type
        })
        .finally(() => {
          setUploading(false)
        })

      if (data) {
        const publicUrl = supabase.storage
          .from('interactions')
          .getPublicUrl(data.path).data.publicUrl
        setVideoUrl(publicUrl)
        setUploading(false)
      }

      if (error) {
        Alert.alert(error.message)
      }
    } else {
      Alert.alert('No video selected')
    }

    setUploading(false)
  }

  return (
    <>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={tw.style('flex-grow')}
        showsVerticalScrollIndicator={false}
      >
        <Box style={tw.style('px-2 pt-3')}>
          <Input
            size="xl"
            onChangeText={useCallback(
              (text: React.SetStateAction<string>) => setName(text),
              []
            )}
            value={name}
            placeholder="Enter name of the interaction"
            autoCapitalize={'none'}
          />
          <Box style={tw.style('py-1 self-stretch')} />

          <Input
            size="xl"
            multiline
            onChangeText={useCallback(
              (text: React.SetStateAction<string>) => setDescription(text),
              []
            )}
            value={description}
            secureTextEntry={true}
            placeholder="Enter a brief description of the interaction"
            autoCapitalize={'none'}
          />
          <Box style={tw.style('py-1 self-stretch')} />
          <Button
            size="lg"
            disabled={loading || uploading}
            loading={loading || uploading}
            onPress={() => void pickVideo()}
          >
            <Text style={tw.style('text-white-900')}>Add video</Text>
          </Button>
        </Box>

        <Box style={tw.style('px-2 py-3')}>
          <Button size="lg" spinner={loading} onPress={() => void post()}>
            <Text style={tw.style('text-white-900')}>Post</Text>
          </Button>
        </Box>
      </ScrollView>
    </>
  )
}
