import { createFileRoute } from "@tanstack/react-router";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import { TestConfigurationForm } from "@/features/tests/components/test-configuration-form";

export const Route = createFileRoute("/_authenticated/tests/create")({
  head: () => ({
    meta: [
      { title: "Create Test — QBank" },
      { name: "description", content: "Generate a new test." },
    ],
  }),
  component: CreateTestPage,
});

function CreateTestPage() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <AppBreadcrumbs />
      </div>
      <TestConfigurationForm />
    </div>
  );
}
