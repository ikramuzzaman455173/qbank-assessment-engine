import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/features/auth/hooks/use-session";
import { useProfile } from "@/features/profile/api/use-profile";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — QBank" },
      { name: "description", content: "Manage your personal profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useSession();
  const { data: profile } = useProfile();

  const email = user?.email ?? "User";
  const displayName = profile?.displayName || email;
  const initials = displayName.substring(0, 2).toUpperCase();
  const joinedAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Manage your personal account information." />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Your current authentication information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="size-20 border border-border">
              {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <User className="size-5 text-muted-foreground" />
                {displayName}
              </h3>
              <p className="text-sm text-muted-foreground">{email}</p>
              <p className="text-xs text-muted-foreground mt-1">Joined {joinedAt}</p>
            </div>
          </div>

          <div className="rounded-md border p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Profile editing functionality will be implemented in a future step along with user
              metadata storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
