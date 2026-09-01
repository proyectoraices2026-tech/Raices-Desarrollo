import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    role: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchRole(userId: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("role_id, roles(name)")
            .eq("id", userId)
            .single();

            console.log("fetchRole data:", data, "error:", error);
            
        if (error || !data) {
            setRole(null);
            return;
        }

        // roles(name) viene como objeto por el join
        setRole((data.roles as unknown as { name: string })?.name ?? null);
    }

    useEffect(() => {
        
        if (window.location.hash && !window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname);
        }
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchRole(session.user.id);
                } else {
                    setRole(null);
                }
                setLoading(false);

                if (event === "PASSWORD_RECOVERY") {
                    window.location.href = "/reset-password";
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);