import { useState, useEffect } from "react";
import {
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { useGeminiKey } from "../api/use-gemini-key";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AiSettings() {
  const { status, customKey, saveKey, isSaving, testKey, isTesting, removeKey } = useGeminiKey();
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (customKey) {
      setInputKey(customKey);
    } else {
      setInputKey("");
    }
  }, [customKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      toast.error("Please enter a valid Gemini API key.");
      return;
    }
    setTestResult(null);
    try {
      const result = await saveKey(inputKey);
      setTestResult({ success: true, message: result.message });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Failed to save key." });
    }
  };

  const handleTest = async () => {
    if (!inputKey.trim()) {
      toast.error("Please enter an API key to test.");
      return;
    }
    setTestResult(null);
    try {
      const result = await testKey(inputKey);
      if (result.success) {
        toast.success(result.message);
        setTestResult({ success: true, message: result.message });
      } else {
        toast.error(result.message);
        setTestResult({ success: false, message: result.message });
      }
    } catch (err: any) {
      toast.error(err.message || "Connection test failed.");
      setTestResult({ success: false, message: err.message || "Test failed." });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Active Status Overview Card */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <CardTitle className="text-xl">AI & Google Gemini Configuration</CardTitle>
              </div>
              <CardDescription>
                Configure your Gemini API Key for instant PDF-to-MCQ extraction and AI question
                generation.
              </CardDescription>
            </div>

            {status.source === "custom" ? (
              <Badge
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 py-1 px-3 self-start sm:self-auto text-xs"
              >
                <CheckCircle2 className="size-3.5" />
                Personal API Key Active
              </Badge>
            ) : status.source === "system" ? (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5 py-1 px-3 self-start sm:self-auto text-xs"
              >
                <Zap className="size-3.5" />
                System Default Key Active
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="flex items-center gap-1.5 py-1 px-3 self-start sm:self-auto text-xs"
              >
                <AlertCircle className="size-3.5" />
                No API Key Configured
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {status.source === "custom" ? (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">
                    Using your personal Gemini API key ({status.maskedKey})
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    You enjoy high private rate limits (up to 15 Requests/Min, 1,000,000 Tokens/Day
                    free). Your key is stored securely in your local browser and never shared.
                  </p>
                </div>
              </div>
            </div>
          ) : status.source === "system" ? (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <Zap className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">
                    Using shared system default quota ({status.maskedKey})
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    A shared key is active for trial use. Since it is shared among users, quota or
                    rate limits may be reached during heavy usage. We highly recommend adding your
                    own free Gemini API key below for uninterrupted personal access!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>No Gemini API Key Available</AlertTitle>
              <AlertDescription className="text-xs mt-1">
                PDF extraction and AI processing will be unavailable until you provide a free Gemini
                API key below.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg border bg-background/60 text-center">
              <span className="text-xs text-muted-foreground block">Supported Models</span>
              <span className="text-sm font-semibold text-foreground">Gemini 3.7 / 2.5 Flash</span>
            </div>
            <div className="p-3 rounded-lg border bg-background/60 text-center">
              <span className="text-xs text-muted-foreground block">Google Free Tier</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                100% Free (No Card)
              </span>
            </div>
            <div className="p-3 rounded-lg border bg-background/60 text-center">
              <span className="text-xs text-muted-foreground block">Key Privacy</span>
              <span className="text-sm font-semibold text-foreground">Local Browser Storage</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Configure Key Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="size-4 text-primary" />
            Manage Custom Gemini API Key
          </CardTitle>
          <CardDescription>
            Enter your Google Gemini API key to override the shared default quota and enjoy your own
            free quota limits.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Gemini API Key</label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    if (testResult) setTestResult(null);
                  }}
                  placeholder="AIzaSy... (Paste your Google Gemini API key here)"
                  className="pr-10 font-mono text-sm"
                  disabled={isSaving || isTesting}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your key begins with{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">
                  AIzaSy
                </code>
                . Get it free from Google AI Studio.
              </p>
            </div>

            {testResult && (
              <Alert
                variant={testResult.success ? "default" : "destructive"}
                className={
                  testResult.success
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                    : ""
                }
              >
                {testResult.success ? (
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="size-4" />
                )}
                <AlertTitle>
                  {testResult.success ? "Connection Verified!" : "Validation Error"}
                </AlertTitle>
                <AlertDescription className="text-xs mt-1">{testResult.message}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={!inputKey.trim() || isTesting || isSaving}
                >
                  {isTesting ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="size-4 mr-2 text-amber-500" />
                  )}
                  Test Connection
                </Button>

                {status.isCustom && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      removeKey();
                      setInputKey("");
                      setTestResult(null);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                    disabled={isSaving || isTesting}
                  >
                    <Trash2 className="size-4 mr-1.5" />
                    Reset to Default
                  </Button>
                )}
              </div>

              <Button type="submit" size="sm" disabled={!inputKey.trim() || isSaving || isTesting}>
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="size-4 mr-2" />
                )}
                Save & Activate Key
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 3. Bilingual Step-by-Step Guide Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="size-4 text-primary" />
                How to Get a Free Gemini API Key (গাইড)
              </CardTitle>
              <CardDescription>
                Step-by-step instructions to obtain a 100% free Gemini API key in under 60 seconds.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="bangla" className="w-full">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Language / ভাষা নির্বাচন করুন:
              </span>
              <TabsList className="grid grid-cols-2 w-48">
                <TabsTrigger value="bangla" className="font-medium">
                  বাংলা (BN)
                </TabsTrigger>
                <TabsTrigger value="english" className="font-medium">
                  English (EN)
                </TabsTrigger>
              </TabsList>
            </div>

            {/* BANGLA GUIDE CONTENT */}
            <TabsContent value="bangla" className="space-y-6 animate-in fade-in-50">
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <h4 className="text-sm font-semibold text-primary mb-1">
                  🌟 কেন নিজস্ব API Key ব্যবহার করবেন?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  আমরা সবার সুবিধার জন্য একটি ফ্রি ডিফল্ট কি (API Key) প্রদান করি। তবে হাজার হাজার
                  ইউজার একসাথে ব্যবহার করলে মাঝে মাঝে কোটা লিমিট শেষ হয়ে যেতে পারে। আপনার নিজস্ব API
                  Key যুক্ত করলে আপনি পাবেন <strong>সম্পূর্ণ নিজস্ব ফ্রি কোটা</strong>, কোনো ক্রেডিট
                  কার্ড ছাড়াই, এবং কখনোই আপনার PDF এক্সট্রাকশন ব্যাহত হবে না।
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    ১
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Google AI Studio ওপেন করুন</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      নিচের লিংকে ক্লিক করে Google AI Studio-এর অফিসিয়াল এপিআই কি পেজে যান:
                    </p>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded border border-primary/20 mt-1"
                    >
                      <span>aistudio.google.com/app/apikey</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    ২
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Google / Gmail দিয়ে সাইন ইন করুন</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      আপনার সাধারণ যেকোনো জিমেইল একাউন্ট দিয়ে লগইন করুন এবং টার্মস ও কন্ডিশন
                      অ্যাকসেপ্ট করুন।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    ৩
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">"Create API key" বাটনে ক্লিক করুন</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      নীল রঙের <strong>"Create API key"</strong> বাটনে ক্লিক করে{" "}
                      <em>"Create key in new project"</em> নির্বাচন করুন।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    ৪
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">API Key কপি করুন</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      তৈরি হওয়া কি-টি কপি করুন (যা{" "}
                      <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
                        AIzaSy...
                      </code>{" "}
                      দিয়ে শুরু হবে)।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    ৫
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">এখানে পেস্ট করে "Save & Activate" করুন</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      উপরের ইনপুট বক্সে আপনার কপি করা কী-টি পেস্ট করুন এবং{" "}
                      <strong>"Save & Activate Key"</strong> বাটনে ক্লিক করুন। সাথে সাথে আপনার
                      পার্সোনাল কী সক্রিয় হয়ে যাবে!
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ENGLISH GUIDE CONTENT */}
            <TabsContent value="english" className="space-y-6 animate-in fade-in-50">
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <h4 className="text-sm font-semibold text-primary mb-1">
                  🌟 Why bring your own Gemini API Key?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We provide a shared system default key for testing and trial use. However, when
                  hundreds of users process large PDFs concurrently, the shared rate limits can get
                  exhausted. By providing your own free Google Gemini API key, you get your{" "}
                  <strong>own dedicated personal quota</strong> (15 requests/minute & 1M tokens/day)
                  with zero bottlenecks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Visit Google AI Studio</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Navigate to Google AI Studio's API Key management page:
                    </p>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded border border-primary/20 mt-1"
                    >
                      <span>aistudio.google.com/app/apikey</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    2
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Sign in with your Google Account</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Log in using any personal or workspace Google / Gmail account. No credit card
                      is required.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    3
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Click "Create API key"</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click the blue <strong>"Create API key"</strong> button, then select{" "}
                      <em>"Create key in new project"</em>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    4
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Copy your API Key</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Copy the generated string that begins with{" "}
                      <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
                        AIzaSy...
                      </code>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    5
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold">Paste and Save here</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Paste the key in the input box above, click <strong>"Test Connection"</strong>{" "}
                      to verify, and hit <strong>"Save & Activate Key"</strong>!
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Key Safety & Details Accordion */}
          <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border bg-muted/30 space-y-1">
              <p className="font-semibold text-xs flex items-center gap-1.5 text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Is my API key private?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes! Your API key is stored strictly on your local browser (LocalStorage) and is
                directly passed to Google APIs from your browser. It is never logged or saved on our
                servers.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border bg-muted/30 space-y-1">
              <p className="font-semibold text-xs flex items-center gap-1.5 text-foreground">
                <Zap className="size-4 text-primary" />
                Does the Google Free Tier expire?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No, Google AI Studio's free tier is continuous and provides free daily requests for
                personal and educational use without requiring billing information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
