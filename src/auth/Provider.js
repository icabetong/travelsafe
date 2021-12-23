import React, { useContext, useState, useEffect } from "react";
import supabase from "../core/Infrastructure";

const AuthContext = React.createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session;

    setUser(session?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: result } = await supabase
          .from('accounts').select().eq('id', session?.user.id);
        if (result && result.length > 0) {
          setProfile(result[0]);
        }
      }
    );

    return () => {
      listener?.unsubscribe();
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