import React, { useContext, useState, useEffect } from "react";
import supabase from "../core/Infrastructure";

const AuthContext = React.createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [status, setStatus] = useState('fetching');

  useEffect(() => {
    const init = async () => {
      const user = supabase.auth.user();

      setUser(user ?? null);
     

      if (user) {
        const { data: result } = await supabase
          .from('accounts')
          .select()
          .eq('id', user.id)
          .single();
        
        if (result) {
          setProfile(result);
          setStatus('authenticated');
        } else {
          setStatus('empty');
        }
      }
    }
    
    init();
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange", { event, session });

      if (event === 'SIGNED_IN') init();
    });

    return () => {
      supabase.removeSubscription();
    }
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
    profile,
    status
  }

  return (
    <AuthContext.Provider value={value}>
      {(status !== 'empty' || status !== 'fetching') && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}