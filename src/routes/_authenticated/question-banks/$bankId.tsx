import { createFileRoute } from "@tanstack/react-router";
import { Settings, Users } from "lucide-react";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/question-banks/$bankId")({
  head: () => ({
    meta: [{ title: "Bank Details — QBank" }],
  }),
  component: QuestionBankDetailsPage,
});

function QuestionBankDetailsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Question Bank Details"
        description="Manage questions and settings for this bank."
        actions={<Button>Add Question</Button>}
      />

      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 size-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="collaborators">
            <Users className="mr-2 size-4" />
            Collaborators
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Question list placeholder.
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Settings form placeholder.
          </div>
        </TabsContent>

        <TabsContent value="collaborators" className="space-y-4">
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            Collaborators management placeholder.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
