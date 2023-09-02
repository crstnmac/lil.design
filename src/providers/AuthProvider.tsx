import React, { createContext, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@app/lib'
import { useSettingsStore } from '@app/store/userSettingsStore'
type ContextProps = {
  user: null | boolean
  session: Session | null
}

const AuthContext = createContext<Partial<ContextProps>>({})

interface Props {
  children: React.ReactNode
}

const AuthProvider = (props: Props) => {
  const { user, session, setSession, setUser } = useSettingsStore(
    (state) => state
  )

  useEffect(() => {
    const getSession = async () => {
      const session = await supabase.auth.getSession()
      setSession(session.data.session)
      setUser(session.data.session ? true : false)
    }

    void getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          console.log(`Supabase auth event: ${event}`)
          setSession(session)
          setUser(session ? true : false)
        }
      }
    )
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [setSession, setUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        session
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
