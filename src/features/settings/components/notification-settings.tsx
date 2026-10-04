import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about via email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Test Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders about incomplete tests.
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Practice Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to maintain your practice streak.
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Product Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and improvements.
              </p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications within the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              In-app notification preferences will be available once the notification delivery
              system is fully deployed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
