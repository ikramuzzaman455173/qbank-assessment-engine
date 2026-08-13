import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { usePreferences, useUpdatePreferences } from "../api/use-preferences";
import { useTheme } from "@/app/providers/theme-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  default_test_question_count: z.coerce.number().min(1).max(500),
  default_test_timer: z.coerce.number().nullable(),
  randomize_questions: z.boolean(),
  randomize_options: z.boolean(),
  default_practice_question_count: z.coerce.number().min(1).max(500),
  immediate_feedback: z.boolean(),
  show_explanations: z.boolean(),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function PreferencesSettings() {
  const { data: preferences, isLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const { setTheme } = useTheme();

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: "system",
      default_test_question_count: 20,
      default_test_timer: null,
      randomize_questions: true,
      randomize_options: false,
      default_practice_question_count: 10,
      immediate_feedback: true,
      show_explanations: true,
    },
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        theme: preferences.theme,
        default_test_question_count: preferences.default_test_question_count,
        default_test_timer: preferences.default_test_timer,
        randomize_questions: preferences.randomize_questions,
        randomize_options: preferences.randomize_options,
        default_practice_question_count: preferences.default_practice_question_count,
        immediate_feedback: preferences.immediate_feedback,
        show_explanations: preferences.show_explanations,
      });
    }
  }, [preferences, form]);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const onSubmit = async (values: PreferencesFormValues) => {
    try {
      await updatePreferences.mutateAsync(values);
      setTheme(values.theme);
      toast.success("Preferences saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the interface theme you prefer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Defaults</CardTitle>
              <CardDescription>Set your default preferences for Test creation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="default_test_question_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Question Count</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="randomize_questions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Randomize Question Order</FormLabel>
                      <FormDescription>Questions appear in random order by default.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="randomize_options"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Randomize Options</FormLabel>
                      <FormDescription>Shuffle the options (A, B, C, D) by default.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Defaults</CardTitle>
              <CardDescription>Set your default preferences for Practice sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="default_practice_question_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Practice Question Count</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="immediate_feedback"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Immediate Feedback</FormLabel>
                      <FormDescription>Show correct/incorrect immediately after answering.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="show_explanations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Explanations</FormLabel>
                      <FormDescription>Display question explanations automatically.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={updatePreferences.isPending}>
              {updatePreferences.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Preferences
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
