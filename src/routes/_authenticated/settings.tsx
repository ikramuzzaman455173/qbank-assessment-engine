import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Settings2,
  Sparkles,
  Bell,
  Database,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { z } from "zod";
import { PageHeader } from "@/components/common";
import { ProfileSettings } from "@/features/settings/components/profile-settings";
import { PreferencesSettings } from "@/features/settings/components/preferences-settings";
import { AiSettings } from "@/features/settings/components/ai-settings";
import { NotificationSettings } from "@/features/settings/components/notification-settings";
import { DataManagementSettings } from "@/features/settings/components/data-management-settings";
import { SecuritySettings } from "@/features/settings/components/security-settings";
import { DangerZone } from "@/features/settings/components/danger-zone";
import { cn } from "@/lib/utils";

type SettingsTab =
  "profile" | "preferences" | "ai" | "notifications" | "data" | "security" | "danger";

const settingsSearchSchema = z.object({
  tab: z
    .enum(["profile", "preferences", "ai", "notifications", "data", "security", "danger"])
    .optional(),
});

export const Route = createFileRoute("/_authenticated/settings")({
  validateSearch: (search: Record<string, unknown>) => settingsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Settings — QBank" },
      { name: "description", content: "Account and application preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>(search.tab || "profile");

  useEffect(() => {
    if (search.tab && search.tab !== activeTab) {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  const handleTabChange = (tabId: SettingsTab) => {
    setActiveTab(tabId);
    void navigate({
      to: "/settings",
      search: { tab: tabId },
      replace: true,
    });
  };

  const tabs: Array<{
    id: SettingsTab;
    label: string;
    icon: any;
    destructive?: boolean;
    badge?: string;
  }> = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings2 },
    { id: "ai", label: "AI & API Keys", icon: Sparkles },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "data", label: "Data Management", icon: Database },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, destructive: true },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and application settings."
      />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 shrink-0 overflow-x-auto md:overflow-visible">
          <nav className="flex md:flex-col gap-1.5 min-w-max md:min-w-0 pb-4 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 text-left cursor-pointer select-none whitespace-nowrap md:whitespace-normal",
                    isActive
                      ? tab.destructive
                        ? "bg-destructive text-destructive-foreground shadow-xs font-semibold"
                        : "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : tab.destructive
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 w-full min-w-0 max-w-4xl">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "ai" && <AiSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "data" && <DataManagementSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "danger" && <DangerZone />}
        </main>
      </div>
    </div>
  );
}
