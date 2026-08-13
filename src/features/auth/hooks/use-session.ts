import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

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
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setState({ session, user: session?.user ?? null, isLoading: false });
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setState({ session: data.session, user: data.session?.user ?? null, isLoading: false });
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}
