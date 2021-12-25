import React, { useContext, useState, useEffect } from "react";
import supabase from "../core/Infrastructure";

const AuthContext = React.createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const user = supabase.auth.user();

      setUser(user ?? null);
      setLoading(false);

      const { data: result } = await supabase
        .from('accounts').select().eq('id', user.id);
      if (result && result.length > 0) {
        setProfile(result[0]);
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
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}