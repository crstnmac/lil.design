import { create } from 'zustand'

interface UserProfileStore {
  avatar: string
  setAvatar: (avatar: string) => void
  username: string
  setUsername: (username: string) => void
  fullName: string
  setFullName: (fullName: string) => void
  bio: string
  setBio: (bio: string) => void
  website: string
  setWebsite: (website: string) => void
  isUserProfileLoading: boolean
  setIsUserProfileLoading: (isUserProfileLoading: boolean) => void
}

export const userProfileStore = create<UserProfileStore>((set, get) => ({
  avatar: '',
  setAvatar: (avatar: string) => set({ avatar }),
  username: '',
  setUsername: (username: string) => set({ username }),
  fullName: '',
  setFullName: (fullName: string) => set({ fullName }),
  bio: '',
  setBio: (bio: string) => set({ bio }),
  website: '',
  setWebsite: (website: string) => set({ website }),
  isUserProfileLoading: false,
  setIsUserProfileLoading: (isUserProfileLoading: boolean) => set({ isUserProfileLoading })
}))
