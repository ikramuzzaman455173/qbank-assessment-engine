import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { GUEST_SESSION, GUEST_USER, isGuestSession } from "../demo-guest-data";

interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

/**
 * Client-side session state for UI affordances (header, avatar, sign out).
 * Route protection is handled by the `_authenticated` layout, not here.
 */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>(() => {
    if (isGuestSession()) {
      return { session: GUEST_SESSION, user: GUEST_USER, isLoading: false };
    }
    return {
      session: null,
      user: null,
      isLoading: true,
    };
  });

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      if (isGuestSession()) {
        if (active) setState({ session: GUEST_SESSION, user: GUEST_USER, isLoading: false });
        return;
      }
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setState({ session: data.session, user: data.session?.user ?? null, isLoading: false });
      } catch (err) {
        if (!active) return;
        setState({ session: null, user: null, isLoading: false });
      }
    };

    const handleAuthChange = () => {
      void syncSession();
    };

    window.addEventListener("kc-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (isGuestSession()) {
        setState({ session: GUEST_SESSION, user: GUEST_USER, isLoading: false });
      } else {
        setState({ session, user: session?.user ?? null, isLoading: false });
      }
    });

    void syncSession();

    return () => {
      active = false;
      window.removeEventListener("kc-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}
