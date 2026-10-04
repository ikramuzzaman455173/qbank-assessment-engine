import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings, User } from "lucide-react";
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

import { clearGuestSession } from "@/features/auth/demo-guest-data";

export function UserMenu() {
  const { user } = useSession();
  const { data: profile } = useProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const displayName = profile?.displayName || user?.email || "User";
  const email = user?.email || "";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="size-8 cursor-pointer border border-border transition-opacity hover:opacity-80">
              {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/settings" search={{ tab: "profile" }}>
                <User className="mr-2 size-4" aria-hidden="true" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={ROUTES.settings}>
                <Settings className="mr-2 size-4" aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowLogoutModal(true);
            }}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 size-4" aria-hidden="true" />
            <span>Log out</span>
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
