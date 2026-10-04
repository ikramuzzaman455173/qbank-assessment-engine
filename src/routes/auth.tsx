import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_CREDENTIALS, isGuestSession, setGuestSession } from "@/features/auth/demo-guest-data";

const authSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => authSearchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    if (isGuestSession()) {
      throw redirect({ to: (search?.redirect || ROUTES.dashboard) as any });
    }
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: (search?.redirect || ROUTES.dashboard) as any });
    }
  },
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAuthError(error: any): string {
  const message = error?.message || "";

  if (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("fetch failed")
  ) {
    return "Cannot connect to Supabase server. Please check your internet connection or verify if your Supabase project is active/unpaused in Supabase Dashboard.";
  }
  if (message.includes("Invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  if (message.includes("User already registered")) {
    return "An account with this email already exists.";
  }
  if (message.includes("Password should be at least")) {
    return "Password does not meet the minimum requirements.";
  }

  return message || "Authentication failed. Please try again.";
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const targetDestination = search.redirect || ROUTES.dashboard;
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const handleAutofillDemo = () => {
    signInForm.setValue("email", DEMO_CREDENTIALS.email);
    signInForm.setValue("password", DEMO_CREDENTIALS.password);
    toast.info("Demo credentials loaded! You can now click 'Sign In' or use 1-Click Guest Login.");
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      // 1. Try real Supabase auth if backend is online
      try {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: DEMO_CREDENTIALS.email,
          password: DEMO_CREDENTIALS.password,
        });

        if (!signInErr) {
          localStorage.removeItem("kc_guest_session");
          toast.success("Welcome, Reviewer! Signed in with Demo Account.");
          void navigate({ to: targetDestination as any });
          return;
        }

        if (signInErr.message?.includes("Invalid login credentials")) {
          const { error: signUpErr } = await supabase.auth.signUp({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
            options: {
              data: { full_name: "Guest Reviewer (Demo)" },
            },
          });
          if (!signUpErr) {
            localStorage.removeItem("kc_guest_session");
            toast.success("Welcome, Reviewer! Demo account initialized.");
            void navigate({ to: targetDestination as any });
            return;
          }
        }
      } catch (networkErr) {
        console.warn(
          "Supabase network not reachable, falling back to instant guest session:",
          networkErr,
        );
      }

      // 2. Instant Guest Session fallback (Zero-latency, 100% reliable)
      setGuestSession();
      toast.success("Welcome! Entered Guest Reviewer demo mode.");
      void navigate({ to: targetDestination as any });
    } catch (err: unknown) {
      toast.error("Could not start guest session. Please try again.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSignIn = async (values: SignInValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      toast.success("Successfully signed in!");
      void navigate({ to: targetDestination as any });
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(mapAuthError(error as any));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: SignUpValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });
      if (error) throw error;

      toast.success("Account created successfully! You are now signed in.");
      void navigate({ to: targetDestination as any });
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(mapAuthError(error as any));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${targetDestination}`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(mapAuthError(error as any));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to={ROUTES.landing}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xs border border-border">
        <CardHeader className="space-y-1 pb-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to QBank</CardTitle>
          <CardDescription>
            Your comprehensive platform for question banks and testing.
          </CardDescription>
          {search.redirect && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                🔒 Please sign in to access your requested page
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            type="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <button
                      type="button"
                      onClick={handleAutofillDemo}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <KeyRound className="size-3" />
                      Autofill demo credentials
                    </button>
                    <Link
                      to="/reset-password"
                      className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            type="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm Password <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" disabled={isLoading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          {/* Guest / Recruiter Demo Fast Access */}
          <div className="relative mt-6 mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2.5 text-muted-foreground font-semibold">
                For Recruiters & Quick Review
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-primary/40 bg-primary/5 hover:bg-primary/10 text-foreground font-semibold py-5 flex items-center justify-center gap-2 group shadow-2xs hover:border-primary transition-all cursor-pointer"
            onClick={handleGuestLogin}
            disabled={isLoading || isGuestLoading}
          >
            {isGuestLoading ? (
              <>
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Entering Guest Mode...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-primary group-hover:scale-110 transition-transform" />
                <span>⚡ Continue as Guest (1-Click Demo)</span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <p className="mt-2.5 text-center text-[11px] text-muted-foreground leading-relaxed">
            Instantly explore pre-populated question banks, real-time tests & analytics without
            registering.
          </p>

          {/*<Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          */}
        </CardContent>
      </Card>
    </div>
  );
}
