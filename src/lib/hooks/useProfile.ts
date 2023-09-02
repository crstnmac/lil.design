import { AuthContext } from '@app/providers'
import { userProfileStore } from '@app/store/userProfileStore'
import { useCallback, useContext } from 'react'
import { supabase } from '../services'

export function useProfile() {
  const setAvatar = userProfileStore((state) => state.setAvatar)
  const setUsername = userProfileStore((state) => state.setUsername)
  const setFullName = userProfileStore((state) => state.setFullName)
  const setBio = userProfileStore((state) => state.setBio)
  const setWebsite = userProfileStore((state) => state.setWebsite)
  const setIsUserProfileLoading = userProfileStore((state) => state.setIsUserProfileLoading)
  const isUserProfileLoading = userProfileStore((state) => state.isUserProfileLoading)
  const avatar = userProfileStore((state) => state.avatar)
  const username = userProfileStore((state) => state.username)
  const fullName = userProfileStore((state) => state.fullName)
  const bio = userProfileStore((state) => state.bio)
  const website = userProfileStore((state) => state.website)
  const auth = useContext(AuthContext)
  const session = auth?.session

  const getProfileData = useCallback(async () => {
    try {
      setIsUserProfileLoading(true)

      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setAvatar(data.avatar_url || '')
        setUsername(data.username || '')
        setWebsite(data.website || '')
        setFullName(data.full_name || '')
        setBio(data.bio || '')
      }

      if (error || status !== 406) {
        setIsUserProfileLoading(false)
        throw error
      }
    } catch (error) {
      setIsUserProfileLoading(false)
    } finally {
      setIsUserProfileLoading(false)
    }
  }, [session?.user, setIsUserProfileLoading, setAvatar, setUsername, setWebsite, setFullName, setBio])

  const updateProfileData = async () => {
    try {
      setIsUserProfileLoading(true)

      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          avatar_url: avatar,
          website,
          bio
        }).eq('id', session.user.id).single()

      console.log(error)

      if (!error) await getProfileData()

      if (error) {
        setIsUserProfileLoading(false)
        throw error
      }
    } catch (error) {
      setIsUserProfileLoading(false)
    } finally {
      setIsUserProfileLoading(false)
    }
  }

  return {
    getProfileData,
    updateProfileData,
    isUserProfileLoading,
    avatar,
    username,
    fullName,
    bio,
    website,
    setAvatar,
    setUsername,
    setFullName,
    setBio,
    setWebsite
  }

}
