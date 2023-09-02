import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserSettingsStore {
  user: null | boolean
  setUser: (user: null | boolean) => void
  session: Session | null
  setSession: (session: Session | null) => void
  isFirstTime: boolean
  setIsFirstTime: (isFirstTime: boolean) => void
  profilePic: string;
  setProfilePic: (profilePic: string) => void
  darkMode: boolean
  toggleDarkMode: () => void
  resetAll: () => void
  status: 'idle' | 'signedIn' | 'signedOut'
  setStatus: (status: 'idle' | 'signedIn' | 'signedOut') => void
}

export const useSettingsStore = create(
  persist<UserSettingsStore>(
    (set, get) => ({
      user: null,
      setUser: (user: null | boolean) => set({ user }),
      setSession: (session: Session | null) => set({ session }),
      session: null,
      isFirstTime: true,
      setIsFirstTime: (isFirstTime: boolean) => set({ isFirstTime }),
      profilePic: 'https://www.gravatar.com/avatar',
      setProfilePic: (profilePic: string) => set({ profilePic }),
      darkMode: false,
      status: 'idle',
      setStatus: (status: 'idle' | 'signedIn' | 'signedOut') => set({ status }),
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      resetAll: () => set({
        isFirstTime: false,
        darkMode: false,
        status: 'signedOut',
        user: false,
        session: null,
      })
    }),
    {
      name: 'user-settings', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
)