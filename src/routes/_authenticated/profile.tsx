import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/features/auth/hooks/use-session";

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

  const email = user?.email ?? "User";
  const initials = email.substring(0, 2).toUpperCase();

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
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <User className="size-5 text-muted-foreground" />
                {email}
              </h3>
              <p className="text-sm text-muted-foreground">Registered User</p>
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
