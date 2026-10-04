import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronDown,
  Layers,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutConfirmDialog } from "@/components/common/logout-confirm-dialog";
import { ROUTES } from "@/constants/routes";
import { useSession } from "@/features/auth/hooks/use-session";
import { useProfile } from "@/features/profile/api/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { clearGuestSession, isGuestSession } from "@/features/auth/demo-guest-data";

export function UserMenu() {
  const { user } = useSession();
  const { data: profile } = useProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Robust guest detection (checks localStorage flag, demo email, or guest metadata)
  const isGuest =
    isGuestSession() ||
    user?.email === "demo@knowledgecanvas.dev" ||
    user?.id === "guest-demo-user-id" ||
    user?.user_metadata?.["full_name"] === "Guest Reviewer (Demo)" ||
    Boolean(profile?.displayName?.toLowerCase().includes("guest"));

  async function handleSignOut() {
    setIsLoggingOut(true);
    try {
      clearGuestSession();
      await queryClient.cancelQueries();
      queryClient.clear();
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signout failed:", err);
      }
      setShowLogoutModal(false);
      void navigate({ to: ROUTES.auth, replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }

  const rawName = isGuest
    ? "Guest Reviewer"
    : profile?.displayName ||
      (user?.user_metadata?.["full_name"] as string | undefined) ||
      user?.email?.split("@")[0] ||
      "User";

  // Clean trailing (Demo) to prevent awkward truncation like "Guest Reviewer (..."
  const displayName = rawName.replace(/\s*\(Demo\)/gi, "").trim();
  const email = user?.email || (isGuest ? "demo@knowledgecanvas.dev" : "");
  const initials = isGuest ? "GR" : displayName.substring(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="User account menu"
            className="group flex items-center gap-2 rounded-full border border-border/80 bg-background/90 hover:bg-muted/60 dark:border-white/10 dark:bg-card/70 dark:hover:bg-muted/40 px-2 py-1 transition-all duration-200 hover:border-primary/40 dark:hover:border-white/20 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer select-none"
          >
            {/* Avatar Capsule with Active Ping Indicator */}
            <div className="relative shrink-0">
              <Avatar className="size-8 rounded-full border-2 border-background shadow-xs transition-transform duration-200 group-hover:scale-105">
                {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
                <AvatarFallback
                  className={
                    isGuest
                      ? "bg-amber-100 text-amber-900 border border-amber-300/80 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-600/40 text-[11px] font-bold"
                      : "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30 text-[11px] font-bold"
                  }
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Live Status Pulse */}
              <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
              </span>
            </div>

            {/* Display Name & Role Badge (hidden on mobile, sleek on desktop) */}
            <div className="hidden sm:flex items-center gap-2 text-left leading-tight">
              <span className="max-w-[130px] md:max-w-[150px] truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {displayName}
              </span>

              {isGuest ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 select-none">
                  <Sparkles className="size-2.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                  Guest
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 select-none">
                  <ShieldCheck className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                  Pro
                </span>
              )}
            </div>

            {/* Chevron Icon */}
            <ChevronDown className="hidden sm:block size-3.5 text-muted-foreground/70 transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-72 p-2 shadow-2xl border border-border/80 dark:border-white/10 bg-popover/95 backdrop-blur-md rounded-2xl animate-in fade-in-50 zoom-in-95"
          align="end"
          forceMount
        >
          {/* Executive User Profile Card */}
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="rounded-xl border border-border/60 bg-muted/40 dark:border-white/10 dark:bg-muted/20 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-11 rounded-full border-2 border-background shadow-xs">
                  {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
                  <AvatarFallback
                    className={
                      isGuest
                        ? "bg-amber-100 text-amber-900 border border-amber-300/80 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-600/40 text-xs font-bold"
                        : "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30 text-xs font-bold"
                    }
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
              </div>

              {/* Role / Plan Banner */}
              {isGuest ? (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-500/25 bg-amber-500/10 dark:bg-amber-950/40 dark:border-amber-500/30 px-2.5 py-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="size-3 text-amber-600 dark:text-amber-400 animate-pulse" />
                    Recruiter Demo Access
                  </span>
                  <span className="rounded bg-amber-500/20 dark:bg-amber-900/60 px-1.5 py-0.5 text-[9.5px] font-bold tracking-wider text-amber-800 dark:text-amber-300 uppercase">
                    Active
                  </span>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-500/25 bg-emerald-500/10 dark:bg-emerald-950/40 dark:border-emerald-500/30 px-2.5 py-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                    Verified Pro Member
                  </span>
                  <span className="rounded bg-emerald-500/20 dark:bg-emerald-900/60 px-1.5 py-0.5 text-[9.5px] font-bold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase">
                    Active
                  </span>
                </div>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Navigation Quick Links */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
              <Link to={ROUTES.questionBanks}>
                <BookOpen className="mr-2.5 size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Question Banks</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
              <Link to={ROUTES.tests}>
                <Layers className="mr-2.5 size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Tests & Practice</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
              <Link to="/settings" search={{ tab: "profile" }}>
                <User className="mr-2.5 size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Profile & Bio</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
              <Link to={ROUTES.settings}>
                <Settings className="mr-2.5 size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5" />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowLogoutModal(true);
            }}
            className="cursor-pointer rounded-lg py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="mr-2.5 size-4" aria-hidden="true" />
            <span className="text-sm font-medium">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmDialog
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleSignOut}
        isPending={isLoggingOut}
      />
    </>
  );
}
