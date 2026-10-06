import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { KeyRound, Mail, CheckCircle2, Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — QBank" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    // Check if user came from a recovery link (hash or query params)
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.includes("type=recovery") || hash.includes("access_token")) {
        setIsRecoveryMode(true);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordUpdated(true);
      toast.success("Password successfully updated!");
      setTimeout(() => {
        void navigate({ to: ROUTES.dashboard as any });
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-md border-border">
        {isRecoveryMode ? (
          <>
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Set New Password</CardTitle>
              <CardDescription>
                Please enter a secure new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordUpdated ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">Password Updated</h3>
                  <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <PasswordInput
                      id="newPassword"
                      placeholder="Enter new password (min. 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Saving New Password..." : "Update Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a recovery link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Account Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-9"
                        autoFocus
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending Link..." : "Send Reset Link"}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-foreground font-medium">Reset instructions sent!</p>
                  <p className="text-xs text-muted-foreground">
                    If an account exists with{" "}
                    <span className="font-semibold text-foreground">{email}</span>, you will receive
                    a reset link shortly. Check your inbox and spam folder.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs"
                  >
                    Resend link or try another email
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Link to={ROUTES.auth} className="text-sm font-medium text-primary hover:underline">
                Back to Sign In
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
