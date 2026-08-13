import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — QBank" },
      { name: "description", content: "Account and application preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and application settings."
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            General settings placeholder.
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Appearance settings placeholder (Theme toggle is also available in the header).
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Notification preferences placeholder.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
