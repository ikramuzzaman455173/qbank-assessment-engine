import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Info,
  Loader2,
  Search,
  Settings,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/common";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Design System — QBank" },
      { name: "description", content: "Production design system and UI foundation showcase." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSimulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Action completed successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Design System & UI Foundation"
        description="A comprehensive showcase of the production-grade semantic UI system, establishing tokens, themes, and reusable components."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info("Info notification triggered")}>
              Test Toast
            </Button>
            <Button onClick={handleSimulateLoad} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Primary Action
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview & Typography</TabsTrigger>
          <TabsTrigger value="tables">Data & Tables</TabsTrigger>
          <TabsTrigger value="forms">Forms & Inputs</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & States</TabsTrigger>
        </TabsList>

        {/* ----------------- TAB: OVERVIEW ----------------- */}
        <TabsContent value="overview" className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Typography Hierarchy</h2>
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Display Heading (H1)
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Used for major page titles or hero sections.
                </p>
              </div>
              <div className="border-t pt-4">
                <h2 className="text-3xl font-semibold tracking-tight">Section Heading (H2)</h2>
                <p className="mt-2 text-muted-foreground">Used for main page sections.</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-2xl font-semibold tracking-tight">Subsection Heading (H3)</h3>
                <p className="mt-2 text-muted-foreground">
                  Used for grouping content within sections.
                </p>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-xl font-semibold tracking-tight">Card Title (H4)</h4>
                <p className="leading-7 mt-2">
                  This is the standard body text. It is designed to be highly readable for long
                  study sessions. The line height and font scale ensure comfort. The quick brown fox
                  jumps over the lazy dog.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This is small muted text, typically used for hints, timestamps, or less important
                  details.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Dashboard Cards</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Questions"
                value="1,248"
                icon={ClipboardList}
                hint="+12 this week"
              />
              <StatCard
                label="Mastery Level"
                value="68%"
                icon={TrendingUp}
                hint="Top 20% of users"
              />
              <StatCard
                label="Tests Completed"
                value="42"
                icon={Target}
                hint="4 tests this month"
              />
              <StatCard label="Active Banks" value="3" icon={BookOpen} hint="1 pending review" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Standard Cards</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Anatomy of a Card</CardTitle>
                  <CardDescription>Cards organize related information cleanly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This surface has a subtle border and uses the background color designated for
                    cards, separating it from the main page background.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col justify-center items-center p-8 text-center border-dashed bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer">
                <div className="rounded-full bg-primary/10 p-3 mb-4 text-primary">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="font-semibold mb-1">Create New Bank</h3>
                <p className="text-sm text-muted-foreground">
                  Start organizing your questions here.
                </p>
              </Card>
            </div>
          </section>
        </TabsContent>

        {/* ----------------- TAB: TABLES ----------------- */}
        <TabsContent value="tables" className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Data Tables</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="w-64 pl-8" />
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px]">Question Snippet</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Reviewed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">What is the capital of France?</TableCell>
                    <TableCell>Geography</TableCell>
                    <TableCell>
                      <StatusBadge tone="success" label="Mastered" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">2 days ago</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Explain the theory of relativity.</TableCell>
                    <TableCell>Physics</TableCell>
                    <TableCell>
                      <StatusBadge tone="warning" label="Needs Review" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">Today</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Define 'Polymorphism' in OOP.</TableCell>
                    <TableCell>Computer Science</TableCell>
                    <TableCell>
                      <StatusBadge tone="neutral" label="Unattempted" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">Never</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      What is the normal blood pH range?
                    </TableCell>
                    <TableCell>Biology</TableCell>
                    <TableCell>
                      <StatusBadge tone="danger" label="Wrong" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">1 week ago</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Name the 5 SOLID principles.</TableCell>
                    <TableCell>Software Eng.</TableCell>
                    <TableCell>
                      <StatusBadge tone="info" label="In Progress" />
                    </TableCell>
                    <TableCell className="text-muted-foreground">Just now</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>

        {/* ----------------- TAB: FORMS ----------------- */}
        <TabsContent value="forms" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Inputs & Controls</h2>
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Question Title</Label>
                    <Input id="title" placeholder="Enter a descriptive title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="science">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Question Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Type your full question here..."
                      className="min-h-[100px]"
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                      Markdown is supported for formatting.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-destructive">Error State Example</Label>
                    <Input
                      className="border-destructive focus-visible:ring-destructive"
                      defaultValue="Invalid input"
                    />
                    <p className="text-[0.8rem] font-medium text-destructive">
                      This field is required.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Toggles & Buttons</h2>
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Public Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see this bank.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-3">
                    <Label>Difficulty Level</Label>
                    <RadioGroup defaultValue="medium" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="r1" />
                        <Label htmlFor="r1" className="font-normal">
                          Easy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="r2" />
                        <Label htmlFor="r2" className="font-normal">
                          Medium
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="r3" />
                        <Label htmlFor="r3" className="font-normal">
                          Hard
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label
                      htmlFor="terms"
                      className="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </Label>
                  </div>

                  <div className="pt-4 space-y-4 border-t">
                    <Label>Button Variants</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button>Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large Size</Button>
                      <Button size="icon" variant="outline">
                        <Settings className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </TabsContent>

        {/* ----------------- TAB: FEEDBACK ----------------- */}
        <TabsContent value="feedback" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Dialogs & Alerts</h2>
              <div className="flex flex-wrap gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Modal</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input defaultValue="Alex Johnson" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setIsDialogOpen(false);
                          toast.success("Saved!");
                        }}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  onClick={() => toast.error("Resource deleted successfully.")}
                >
                  Trigger Destructive Toast
                </Button>
              </div>

              <div className="space-y-4 pt-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Did you know?</AlertTitle>
                  <AlertDescription>
                    Spaced repetition significantly improves long-term memory retention.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>
                    Unable to save your progress. Please check your internet connection.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Course Mastery</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Reusable States</h2>
              <div className="grid gap-4">
                <div className="rounded-lg border p-1">
                  <EmptyState
                    icon={BookOpen}
                    title="No tests found"
                    description="You haven't taken any tests yet."
                    action={<Button size="sm">Start a Test</Button>}
                  />
                </div>

                <div className="rounded-lg border p-1">
                  <ErrorState
                    title="Failed to load questions"
                    description="The server responded with an error. Please try again."
                    onRetry={() => toast("Retrying...")}
                  />
                </div>

                <div className="rounded-lg border p-1">
                  <LoadingState label="Analyzing your performance..." />
                </div>
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
